import { extractTextFromFile } from '../utils/textExtractor.js';
import { analyzeResume } from '../utils/api.js';

const DEMO_PRESETS = {
  frontend: {
    name: '⚡ Senior Frontend Engineer',
    resume: `SENIOR FRONTEND ENGINEER
Experience:
• Developed high-performance single page web applications using React.js, JavaScript (ES6+), HTML5, and CSS3/SASS.
• Managed a team of 4 frontend engineers, conducting code reviews and mentoring junior developers.
• Optimized application rendering and asset loading, improving page load speeds by 40% across core user flows.
• Built reusable UI component libraries and integrated RESTful APIs with Node.js backends.
• Collaborated closely with UI/UX designers to translate Figma mockups into responsive web components.`,
    job: `We are looking for a Senior Frontend Engineer to join our web team.
Requirements:
- 4+ years of professional experience with React.js, TypeScript, Next.js, and modern JavaScript.
- Proficiency with GraphQL APIs, state management (Redux/Zustand), and Tailwind CSS.
- Strong understanding of web performance optimization, automated testing (Jest, Cypress), and CI/CD pipelines.
- Experience building scalable micro-frontend architectures in cloud environments (AWS/Vercel).`
  },
  pm: {
    name: '📊 Product Manager',
    resume: `SENIOR PRODUCT MANAGER
Experience:
• Led cross-functional teams of engineers, designers, and marketers to deliver enterprise SaaS products.
• Defined product roadmaps, user stories, and acceptance criteria using Jira and Agile methodologies.
• Analyzed key product metrics using SQL, Mixpanel, and Google Analytics to drive user retention strategies.
• Conducted over 50 customer interviews to identify key pain points and validate new feature concepts.`,
    job: `Seeking a Technical Product Manager to lead our API Platform team.
Requirements:
- 3+ years experience as a Product Manager in tech/SaaS environments.
- Strong technical acumen with REST APIs, Microservices, Data Analytics, and Cloud Infrastructure.
- Proven track record of running A/B tests, managing product backlogs in Jira, and using SQL for data-driven decisions.
- Excellent stakeholder communication and leadership skills.`
  },
  fullstack: {
    name: '💻 Full Stack Software Engineer',
    resume: `FULL STACK SOFTWARE ENGINEER
Experience:
• Built scalable backend services in Python (Django/FastAPI) and Node.js with PostgreSQL and Redis databases.
• Developed interactive web interfaces using Vue.js, Vuex, and Vanilla CSS with responsive design principles.
• Containerized applications using Docker and configured continuous deployment pipelines on AWS EC2.
• Wrote automated unit and integration tests, maintaining over 85% code coverage across repositories.`,
    job: `Looking for a Full Stack Engineer to join our growing cloud platform team.
Requirements:
- Professional experience with Python, Node.js, PostgreSQL, Docker, and Kubernetes.
- Familiarity with modern frontend frameworks (React, Vue, or Angular) and TypeScript.
- Hands-on experience with AWS services (S3, Lambda, CloudWatch, DynamoDB) and microservice architecture.`
  }
};

export function renderAnalyzerPage(onNavigate, onSetAnalysisData) {
  const container = document.createElement('div');
  container.className = 'analyzer-page';

  container.innerHTML = `
    <!-- Top Nav Bar -->
    <header class="navbar">
      <a href="/" class="nav-brand" id="brand-link">
        Signal <span>.</span>
      </a>
    </header>

    <main class="analyzer-container">
      <div class="analyzer-header">
        <h1 class="analyzer-title">Paste your resume and the job post.</h1>
        
        <!-- 1-Click Demo Presets -->
        <div class="demo-presets-bar">
          <span class="demo-preset-label">Try instant demo:</span>
          <button class="demo-preset-btn" data-preset="frontend">⚡ Senior Frontend</button>
          <button class="demo-preset-btn" data-preset="pm">📊 Product Manager</button>
          <button class="demo-preset-btn" data-preset="fullstack">💻 Full Stack</button>
        </div>
      </div>

      <!-- Two Side-By-Side Input Cards -->
      <div class="analyzer-grid">
        
        <div class="input-card" id="resume-card">
          <div class="input-card-title">
            <span>Your resume</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A373" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>

          <div class="drag-zone" id="resume-drag-zone">
            <div class="drag-zone-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <span>Drop a file (.pdf, .docx, .txt) — we'll extract the text</span>
            <input type="file" id="resume-file-input" accept=".pdf,.docx,.doc,.txt" style="display: none;" />
          </div>

          <textarea 
            class="analyzer-textarea" 
            id="resume-textarea" 
            placeholder="Paste your resume text here..."
          ></textarea>

          <div class="field-error-msg" id="resume-error" style="display: none;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span id="resume-error-text">Paste your resume to continue</span>
          </div>
        </div>

        <div class="input-card" id="job-card">
          <div class="input-card-title">
            <span>The job post</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A373" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>

          <textarea 
            class="analyzer-textarea" 
            id="job-textarea" 
            style="height: 295px;"
            placeholder="Paste the job description here..."
          ></textarea>

          <div class="field-error-msg" id="job-error" style="display: none;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span id="job-error-text">Paste the job post to continue</span>
          </div>
        </div>

      </div>

      <div class="keyword-ticker-box" id="keyword-ticker" style="display: none;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span id="ticker-text">Detected overlapping keywords</span>
      </div>

      <div class="scan-action-container">
        <button class="scan-submit-btn" id="scan-now-btn" disabled>
          Scan now
        </button>
      </div>

    </main>

    <footer class="footer-banner">
      Signal — built for Hack Devengers 1.0
    </footer>
  `;

  const resumeCard = container.querySelector('#resume-card');
  const jobCard = container.querySelector('#job-card');
  const resumeTextarea = container.querySelector('#resume-textarea');
  const jobTextarea = container.querySelector('#job-textarea');
  const resumeError = container.querySelector('#resume-error');
  const jobError = container.querySelector('#job-error');
  const scanBtn = container.querySelector('#scan-now-btn');
  const dragZone = container.querySelector('#resume-drag-zone');
  const fileInput = container.querySelector('#resume-file-input');
  const tickerBox = container.querySelector('#keyword-ticker');
  const tickerText = container.querySelector('#ticker-text');

  function validateInputs() {
    const rVal = resumeTextarea.value.trim();
    const jVal = jobTextarea.value.trim();

    if (rVal) {
      resumeCard.classList.remove('error');
      resumeError.style.display = 'none';
    }

    if (jVal) {
      jobCard.classList.remove('error');
      jobError.style.display = 'none';
    }

    scanBtn.disabled = !(rVal.length > 0 && jVal.length > 0);

    if (rVal.length > 20 && jVal.length > 20) {
      const cleanWords = text => text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const rSet = new Set(cleanWords(rVal));
      const jWords = cleanWords(jVal);
      const common = jWords.filter(w => rSet.has(w));
      const uniqueCommon = new Set(common);

      tickerBox.style.display = 'inline-flex';
      tickerText.textContent = `Detected ~${uniqueCommon.size} overlapping keywords ready for scan`;
    } else {
      tickerBox.style.display = 'none';
    }
  }

  resumeTextarea.addEventListener('input', validateInputs);
  jobTextarea.addEventListener('input', validateInputs);

  container.querySelectorAll('.demo-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const preset = DEMO_PRESETS[presetKey];
      if (preset) {
        resumeTextarea.value = preset.resume;
        jobTextarea.value = preset.job;
        validateInputs();

        container.querySelectorAll('.demo-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  dragZone.addEventListener('click', () => fileInput.click());

  dragZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragZone.classList.add('dragover');
  });

  dragZone.addEventListener('dragleave', () => {
    dragZone.classList.remove('dragover');
  });

  dragZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  async function handleFileSelected(file) {
    try {
      dragZone.querySelector('span').textContent = `Extracting ${file.name}...`;
      const text = await extractTextFromFile(file);
      resumeTextarea.value = text;
      dragZone.querySelector('span').textContent = `Extracted text from ${file.name}`;
      validateInputs();
    } catch (err) {
      console.error(err);
      dragZone.querySelector('span').textContent = `Could not read ${file.name}. Try pasting raw text.`;
    }
  }

  scanBtn.addEventListener('click', async () => {
    const resumeText = resumeTextarea.value.trim();
    const jobText = jobTextarea.value.trim();

    let hasError = false;

    if (!resumeText) {
      resumeCard.classList.add('error');
      resumeError.style.display = 'flex';
      hasError = true;
    }

    if (!jobText) {
      jobCard.classList.add('error');
      jobError.style.display = 'flex';
      hasError = true;
    }

    if (hasError) return;

    scanBtn.disabled = true;
    scanBtn.innerHTML = `
      <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle></svg>
      Scanning...
    `;

    resumeCard.classList.add('pulsing');
    jobCard.classList.add('pulsing');

    const response = await analyzeResume(resumeText, jobText);

    resumeCard.classList.remove('pulsing');
    jobCard.classList.remove('pulsing');

    if (response.success) {
      const enrichedData = { ...response.data, originalResumeText: resumeText };
      onSetAnalysisData(enrichedData);
      onNavigate('/results');
    } else {
      onSetAnalysisData({ error: response.error });
      onNavigate('/results');
    }
  });

  container.querySelector('#brand-link').addEventListener('click', (e) => {
    e.preventDefault();
    onNavigate('/');
  });

  return container;
}
