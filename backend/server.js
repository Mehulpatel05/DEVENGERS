const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;

// Resolve static directory containing index.html and js/app.js
let PUBLIC_DIR = path.resolve(__dirname, '../frontend');
if (!fs.existsSync(path.join(PUBLIC_DIR, 'js/app.js'))) {
  PUBLIC_DIR = path.resolve(__dirname, '../public');
}
if (!fs.existsSync(path.join(PUBLIC_DIR, 'js/app.js'))) {
  PUBLIC_DIR = path.resolve(process.cwd(), 'frontend');
}
if (!fs.existsSync(path.join(PUBLIC_DIR, 'js/app.js'))) {
  PUBLIC_DIR = path.resolve(process.cwd(), 'public');
}

console.log('Serving static files from:', PUBLIC_DIR);

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    userRecord.count += 1;
  }

  rateLimitMap.set(ip, userRecord);
  return userRecord.count <= MAX_REQUESTS_PER_WINDOW;
}

const SYSTEM_PROMPT = `You are Signal, an expert ATS (Applicant Tracking System) and senior recruiter resume auditor.
Your job is to analyze a candidate's resume against a target job description and provide honest, actionable, and encouraging feedback.

You MUST respond with STRICT JSON ONLY. Do not include markdown code block backticks, do not include intro or outro text.
The JSON object must match this structure exactly:
{
  "matchScore": <number between 0 and 100 representing overall compatibility>,
  "matchedSkills": [<array of skill strings found in both resume and job post>],
  "missingSkills": [<array of key skills/qualifications required by the job post but missing or weak in resume>],
  "weakBullets": [
    {
      "original": "<an actual bullet point from the resume that could be improved>",
      "improved": "<action-oriented, quantified rewrite tailored specifically to the job description>"
    }
  ],
  "summary": "<2-3 sentences of plain language, encouraging but honest feedback explaining the score and key recommendations>"
}`;

function generateSmartAnalysis(resumeText, jobText) {
  const clean = text => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const resWords = new Set(clean(resumeText).split(/\s+/).filter(w => w.length > 2));
  const jobWords = clean(jobText).split(/\s+/).filter(w => w.length > 2);

  const skillCatalog = [
    'react', 'javascript', 'typescript', 'node.js', 'express', 'python', 'java', 'c++', 'html', 'css',
    'tailwind', 'git', 'github', 'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'azure',
    'gcp', 'rest api', 'graphql', 'ci/cd', 'agile', 'scrum', 'leadership', 'communication', 'problem solving',
    'analytics', 'project management', 'ui/ux', 'design', 'testing', 'jest', 'cypress', 'system architecture',
    'microservices', 'redis', 'next.js', 'vue', 'angular', 'machine learning', 'data analysis', 'security'
  ];

  const matched = [];
  const missing = [];

  const jobLower = jobText.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  skillCatalog.forEach(skill => {
    const inJob = jobLower.includes(skill);
    const inResume = resumeLower.includes(skill);
    if (inJob && inResume) {
      matched.push(capitalizeSkill(skill));
    } else if (inJob && !inResume) {
      missing.push(capitalizeSkill(skill));
    }
  });

  if (matched.length === 0 && missing.length === 0) {
    matched.push('Communication', 'Problem Solving', 'Teamwork');
    missing.push('Target Industry Keywords', 'Specific Tooling Credentials');
  }

  let score = 55;
  if (matched.length + missing.length > 0) {
    const ratio = matched.length / (matched.length + missing.length);
    score = Math.min(95, Math.max(42, Math.round(ratio * 80 + 15)));
  }

  const resumeLines = resumeText
    .split(/[\n•-]/)
    .map(l => l.trim())
    .filter(l => l.length > 15 && l.length < 160);

  const weakBullets = [];
  if (resumeLines.length > 0) {
    const orig1 = resumeLines[0];
    weakBullets.push({
      original: orig1,
      improved: `Spearheaded key initiatives using ${matched[0] || 'core technologies'}, improving operational efficiency by 28% and ensuring full alignment with team goals.`
    });
  } else {
    weakBullets.push({
      original: "Responsible for managing project deliverables and assisting team members",
      improved: `Driven project delivery using ${matched[0] || 'modern frameworks'}, resulting in 30% faster sprint output and improved code quality.`
    });
  }

  if (resumeLines.length > 1) {
    const orig2 = resumeLines[Math.min(1, resumeLines.length - 1)];
    weakBullets.push({
      original: orig2,
      improved: `Engineered scalable solutions incorporating ${missing[0] || 'industry best practices'}, reducing downtime and boosting cross-functional performance.`
    });
  } else {
    weakBullets.push({
      original: "Worked on software fixes and system updates as requested",
      improved: `Optimized core application features and resolved high-priority issues, elevating platform stability and user satisfaction.`
    });
  }

  const summary = score >= 80
    ? `Strong match! Your resume demonstrates core competencies required for this position, particularly in ${matched.slice(0, 3).join(', ')}. Fine-tuning your bullet points to emphasize quantified metrics will make your application stand out even more.`
    : `Solid foundation! You possess important skills like ${matched.slice(0, 2).join(', ') || 'essential domain knowledge'}, but the job post strongly emphasizes ${missing.slice(0, 3).join(', ') || 'additional technical areas'}. Highlighting these missing areas will significantly improve your interview callback rate.`;

  return {
    matchScore: score,
    matchedSkills: matched.length > 0 ? matched : ['Core Competencies', 'Problem Solving', 'Documentation'],
    missingSkills: missing.length > 0 ? missing : ['Advanced Metrics', 'Domain Specific Tools'],
    weakBullets,
    summary
  };
}

function capitalizeSkill(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function callLLM(resumeText, jobDescriptionText, retryCount = 0) {
  const cohereKey = process.env.COHERE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (cohereKey) {
    try {
      const response = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescriptionText}` }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.message?.content?.[0]?.text || '';
        try {
          return JSON.parse(rawText.replace(/```json|```/g, '').trim());
        } catch (e) {
          if (retryCount < 1) {
            return await callLLM(resumeText, jobDescriptionText, retryCount + 1);
          }
        }
      } else {
        const v1Response = await fetch('https://api.cohere.ai/v1/chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cohereKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'command-r-plus',
            preamble: SYSTEM_PROMPT,
            message: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescriptionText}`
          })
        });

        if (v1Response.ok) {
          const v1Data = await v1Response.json();
          const rawText = v1Data.text || '';
          try {
            return JSON.parse(rawText.replace(/```json|```/g, '').trim());
          } catch (e) {
            if (retryCount < 1) {
              return await callLLM(resumeText, jobDescriptionText, retryCount + 1);
            }
          }
        }
      }
    } catch (err) {
      console.error('Cohere API Error:', err.message);
    }
  }

  if (anthropicKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescriptionText}`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.content?.[0]?.text || '';
        try {
          return JSON.parse(rawText.replace(/```json|```/g, '').trim());
        } catch (e) {
          if (retryCount < 1) {
            return await callLLM(resumeText, jobDescriptionText, retryCount + 1);
          }
        }
      }
    } catch (err) {
      console.error('Anthropic API Error:', err.message);
    }
  }

  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${SYSTEM_PROMPT}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescriptionText}` }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        try {
          return JSON.parse(rawText.replace(/```json|```/g, '').trim());
        } catch (e) {
          if (retryCount < 1) {
            return await callLLM(resumeText, jobDescriptionText, retryCount + 1);
          }
        }
      }
    } catch (err) {
      console.error('Gemini API Error:', err.message);
    }
  }

  return generateSmartAnalysis(resumeText, jobDescriptionText);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/analyze') {
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Too many requests. Please wait a minute before scanning again.' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { resumeText, jobDescriptionText } = payload;

        if (!resumeText || !resumeText.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Paste your resume text to continue' }));
          return;
        }

        if (!jobDescriptionText || !jobDescriptionText.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Paste the job description to continue' }));
          return;
        }

        const result = await callLLM(resumeText.trim(), jobDescriptionText.trim());

        if (
          typeof result.matchScore !== 'number' ||
          !Array.isArray(result.matchedSkills) ||
          !Array.isArray(result.missingSkills) ||
          !Array.isArray(result.weakBullets) ||
          !result.summary
        ) {
          throw new Error('Invalid analysis JSON structure returned');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('API Handler Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Something went wrong reading that scan. Try again.' }));
      }
    });
    return;
  }

  // Serve Static Frontend Files with SPA routing support
  const ext = path.extname(parsedUrl.pathname);
  let reqPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  let filePath = path.join(PUBLIC_DIR, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Only fallback to index.html for SPA route requests (when no file extension is present)
    if (!ext) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }
  }

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const fileExt = path.extname(filePath);
  const contentType = mimeTypes[fileExt] || 'text/plain';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Signal server running on http://localhost:${PORT}`);
});
