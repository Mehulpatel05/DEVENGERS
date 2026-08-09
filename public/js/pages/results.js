export function renderResultsPage(data, onNavigate) {
  const container = document.createElement('div');
  container.className = 'results-page';

  if (!data || data.error) {
    container.innerHTML = `
      <header class="navbar">
        <a href="/" class="nav-brand" id="brand-link">
          Signal <span>.</span>
        </a>
        <button class="nav-cta" id="nav-new-scan-btn">New scan</button>
      </header>

      <main class="analyzer-container">
        <div class="error-boundary-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D96B6B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div class="error-boundary-title">Something went wrong reading that scan. Try again.</div>
          <p style="color: var(--navy-muted); font-size: 0.95rem;">${data?.error || 'Unable to connect to the analysis engine.'}</p>
          <button class="nav-cta" id="retry-btn" style="margin-top: 1rem;">Retry scan</button>
        </div>
      </main>

      <footer class="footer-banner">
        Signal — built for Hack Devengers 1.0
      </footer>
    `;

    container.querySelector('#brand-link').addEventListener('click', (e) => { e.preventDefault(); onNavigate('/'); });
    container.querySelector('#nav-new-scan-btn').addEventListener('click', () => onNavigate('/scan'));
    container.querySelector('#retry-btn').addEventListener('click', () => onNavigate('/scan'));
    return container;
  }

  const { matchScore, matchedSkills, missingSkills, weakBullets, summary, originalResumeText } = data;

  const isHighMatch = matchScore >= 80;
  const gaugeColor = isHighMatch ? '#2D8CFF' : '#D4A373';

  container.innerHTML = `
    <!-- Top Nav Bar -->
    <header class="navbar">
      <a href="/" class="nav-brand" id="brand-link">
        Signal <span>.</span>
      </a>
      <button class="nav-cta" id="nav-new-scan-btn">
        New scan
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </header>

    <main class="results-container">
      
      <!-- Top Section: SVG Gauge & AI Summary -->
      <section class="results-hero-card">
        <div class="score-gauge-box">
          <div class="gauge-svg-wrapper">
            <svg viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EAE4F5" stroke-width="3.5" />
              <path id="gauge-arc-path" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${gaugeColor}" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" style="transition: stroke-dasharray 1.2s ease-out;" />
            </svg>
            <div class="gauge-score-center">
              <div class="gauge-num" id="animated-score-num">0</div>
              <div class="gauge-total">/100</div>
            </div>
          </div>
        </div>

        <div class="results-summary-headline">
          "${escapeHtml(summary)}"
        </div>
      </section>

      <!-- ATS Health Checklist Section -->
      <section class="results-section-card">
        <h2 class="results-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" stroke-width="2.5"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          ATS Health & Compatibility Checklist
        </h2>
        <div class="ats-checklist-grid">
          <div class="ats-check-item">
            <div class="ats-check-icon ${matchedSkills.length > 2 ? 'pass' : 'warn'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <div class="ats-check-title">Skill Keyword Match</div>
              <div class="ats-check-desc">${matchedSkills.length} key qualifications aligned with job post</div>
            </div>
          </div>

          <div class="ats-check-item">
            <div class="ats-check-icon pass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <div class="ats-check-title">File & Layout Readability</div>
              <div class="ats-check-desc">Clean plain text structure readable by top ATS parsers</div>
            </div>
          </div>

          <div class="ats-check-item">
            <div class="ats-check-icon ${weakBullets.length > 0 ? 'warn' : 'pass'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div>
              <div class="ats-check-title">Action Verbs & Impact</div>
              <div class="ats-check-desc">${weakBullets.length} bullet points recommended for stronger metric rewrites</div>
            </div>
          </div>

          <div class="ats-check-item">
            <div class="ats-check-icon ${missingSkills.length === 0 ? 'pass' : 'warn'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div>
              <div class="ats-check-title">Requirement Coverage</div>
              <div class="ats-check-desc">${missingSkills.length} missing skill gaps identified</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Matched Skills Section -->
      <section class="results-section-card">
        <h2 class="results-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Matched Skills (${matchedSkills.length})
        </h2>
        <div class="skills-row">
          ${matchedSkills.map(skill => `
            <span class="skill-pill skill-pill-matched">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${escapeHtml(skill)}
            </span>
          `).join('')}
        </div>
      </section>

      <!-- Missing Skills Section -->
      <section class="results-section-card">
        <h2 class="results-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A373" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3"><circle cx="12" cy="12" r="9"></circle></svg>
          Missing Skills & Requirements (${missingSkills.length})
        </h2>
        <div class="skills-row">
          ${missingSkills.map(skill => `
            <span class="skill-pill skill-pill-missing">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"><circle cx="12" cy="12" r="9"></circle></svg>
              ${escapeHtml(skill)}
            </span>
          `).join('')}
        </div>
      </section>

      <!-- Rewrite Suggestions Section -->
      <section class="results-section-card">
        <h2 class="results-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          AI Rewrite Suggestions
        </h2>

        <div class="bullets-list">
          ${weakBullets.map((item) => `
            <div class="bullet-card">
              <div class="bullet-original">${escapeHtml(item.original)}</div>
              <div class="bullet-divider">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                AI Improved Bullet
              </div>
              <div class="bullet-improved-row">
                <div class="bullet-improved">${escapeHtml(item.improved)}</div>
                <button class="bullet-copy-btn" data-text="${escapeAttribute(item.improved)}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Bottom Action Buttons -->
      <div class="results-actions-bar">
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button class="btn-secondary-outline" id="copy-report-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy report
          </button>

          <button class="btn-secondary-outline" id="download-tailored-btn" style="color: var(--navy); border-color: var(--navy);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download tailored resume
          </button>
        </div>

        <button class="hero-cta-btn" id="run-another-btn" style="margin-top: 0;">
          Run another scan
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>

    </main>

    <footer class="footer-banner">
      Signal — built for Hack Devengers 1.0
    </footer>
  `;

  container.querySelector('#brand-link').addEventListener('click', (e) => { e.preventDefault(); onNavigate('/'); });
  container.querySelector('#nav-new-scan-btn').addEventListener('click', () => onNavigate('/scan'));
  container.querySelector('#run-another-btn').addEventListener('click', () => onNavigate('/scan'));

  setTimeout(() => {
    const arcPath = container.querySelector('#gauge-arc-path');
    const scoreNum = container.querySelector('#animated-score-num');

    if (arcPath) {
      arcPath.style.strokeDasharray = `${matchScore}, 100`;
    }

    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(progress * matchScore);
      if (scoreNum) scoreNum.textContent = val;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (scoreNum) scoreNum.textContent = matchScore;
        if (isHighMatch) {
          triggerConfettiCelebration();
        }
      }
    }
    requestAnimationFrame(step);
  }, 100);

  container.querySelectorAll('.bullet-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-text');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        `;
        setTimeout(() => { btn.innerHTML = origText; }, 2000);
      });
    });
  });

  const copyBtn = container.querySelector('#copy-report-btn');
  copyBtn.addEventListener('click', () => {
    const reportText = `SIGNAL SCAN REPORT
Match Score: ${matchScore}/100

SUMMARY:
${summary}

MATCHED SKILLS:
${matchedSkills.join(', ')}

MISSING SKILLS:
${missingSkills.join(', ')}

REWRITE SUGGESTIONS:
${weakBullets.map((b, i) => `${i + 1}. ORIGINAL: ${b.original}\n   IMPROVED: ${b.improved}`).join('\n\n')}
`;
    navigator.clipboard.writeText(reportText).then(() => {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Report copied!
      `;
      setTimeout(() => { copyBtn.innerHTML = origHtml; }, 2500);
    });
  });

  const downloadBtn = container.querySelector('#download-tailored-btn');
  downloadBtn.addEventListener('click', () => {
    let tailoredText = originalResumeText || `TAILORED RESUME

SUMMARY:
${summary}

HIGHLIGHTED SKILLS:
${matchedSkills.concat(missingSkills).join(', ')}

IMPROVED EXPERIENCE BULLETS:
${weakBullets.map(b => `• ${b.improved}`).join('\n')}
`;

    if (originalResumeText) {
      weakBullets.forEach(b => {
        if (b.original && tailoredText.includes(b.original)) {
          tailoredText = tailoredText.replace(b.original, b.improved);
        }
      });
    }

    const blob = new Blob([tailoredText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Tailored_Resume_Signal.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  return container;
}

function triggerConfettiCelebration() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#2D8CFF', '#D4A373', '#0B132B', '#EAE4F5'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      alpha: 1
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.alpha -= 0.015;

      if (p.alpha > 0) {
        active = true;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (active) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
