export function renderLandingPage(onNavigate) {
  const container = document.createElement('div');
  container.className = 'landing-page';

  container.innerHTML = `
    <!-- Top Nav Bar -->
    <header class="navbar">
      <a href="/" class="nav-brand" id="brand-link">
        Signal <span>.</span>
      </a>
      <button class="nav-cta" id="nav-scan-btn">
        Scan my resume
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="hero-container">
        <div class="hero-text-content">
          <h1 class="hero-headline">See exactly why you didn't get the interview.</h1>
          <p class="hero-subheadline">
            Paste your resume alongside any target job post to get an instant, specific match breakdown — including identified skill gaps and AI-rewritten bullet points.
          </p>
          <button class="hero-cta-btn" id="hero-start-btn">
            Start free scan
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        <!-- Floating Mock Card -->
        <div class="hero-card-container">
          <div class="mock-card">
            <div class="mock-gauge">
              <svg viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EAE4F5" stroke-width="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#D4A373" stroke-width="3.5" stroke-dasharray="78, 100" stroke-linecap="round" />
              </svg>
              <div class="mock-gauge-score">78</div>
            </div>

            <!-- Skill Pills -->
            <div class="mock-pills-row">
              <span class="pill pill-matched">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                React.js
              </span>
              <span class="pill pill-matched">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                TypeScript
              </span>
              <span class="pill pill-missing">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2"><circle cx="12" cy="12" r="9"></circle></svg>
                GraphQL
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3-Column How It Works Section -->
      <section class="how-it-works-section">
        <div class="how-it-works-container">
          <h2 class="section-title">How Signal Works</h2>
          <div class="how-it-works-grid">
            
            <div class="step-card">
              <div class="step-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3 class="step-title">1. Paste your resume</h3>
              <p class="step-desc">Drop in your raw resume text or drop a file (.pdf, .docx, .txt) to extract your experience instantly.</p>
            </div>

            <div class="step-card">
              <div class="step-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 class="step-title">2. Paste the job post</h3>
              <p class="step-desc">Copy the full job description from LinkedIn, Indeed, or company career pages.</p>
            </div>

            <div class="step-card">
              <div class="step-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 class="step-title">3. Get your scan</h3>
              <p class="step-desc">Receive a match score, missing skill gaps, and AI-powered bullet point rewrites tailored to pass the ATS filter.</p>
            </div>

          </div>
        </div>
      </section>
    </main>

    <footer class="footer-banner">
      Signal — built for Hack Devengers 1.0
    </footer>
  `;

  container.querySelector('#nav-scan-btn').addEventListener('click', () => onNavigate('/scan'));
  container.querySelector('#hero-start-btn').addEventListener('click', () => onNavigate('/scan'));
  container.querySelector('#brand-link').addEventListener('click', (e) => {
    e.preventDefault();
    onNavigate('/');
  });

  return container;
}
