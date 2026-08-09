import { renderLandingPage } from './pages/landing.js';
import { renderAnalyzerPage } from './pages/analyzer.js';
import { renderResultsPage } from './pages/results.js';

let analysisData = null;

function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderRoute();
}

function setAnalysisData(data) {
  analysisData = data;
}

function renderRoute() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;
  appContainer.innerHTML = '';

  const path = window.location.pathname;

  let pageElement;
  if (path === '/scan') {
    pageElement = renderAnalyzerPage(navigateTo, setAnalysisData);
  } else if (path === '/results') {
    pageElement = renderResultsPage(analysisData, navigateTo);
  } else {
    pageElement = renderLandingPage(navigateTo);
  }

  appContainer.appendChild(pageElement);
  attachGlobalGuideModal();
  window.scrollTo(0, 0);
}

function attachGlobalGuideModal() {
  const navbars = document.querySelectorAll('.navbar');
  navbars.forEach(nav => {
    if (!nav.querySelector('.nav-guide-btn')) {
      const guideBtn = document.createElement('button');
      guideBtn.className = 'nav-guide-btn';
      guideBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        App Guide
      `;
      guideBtn.addEventListener('click', showGuideModal);

      const cta = nav.querySelector('.nav-cta');
      if (cta) {
        nav.insertBefore(guideBtn, cta);
      } else {
        nav.appendChild(guideBtn);
      }
    }
  });
}

function showGuideModal() {
  let modalOverlay = document.querySelector('.guide-modal-overlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    return;
  }

  modalOverlay = document.createElement('div');
  modalOverlay.className = 'guide-modal-overlay';
  modalOverlay.innerHTML = `
    <div class="guide-modal-card">
      <div class="guide-modal-header">
        <h2>📖 Signal — App Architecture & Page Breakdown</h2>
        <button class="guide-close-btn" id="close-guide-modal">&times;</button>
      </div>
      <div class="guide-modal-body">
        
        <div class="guide-section">
          <h3>🏠 1. Landing Page (Home — <code>/</code>)</h3>
          <p><strong>Purpose:</strong> Introduces Signal's core value proposition and converts visitors into scanning their resumes instantly with zero login requirement.</p>
          <ul>
            <li><strong>Navy Nav Bar:</strong> Contains the Signal logo and a direct "Scan my resume" CTA button.</li>
            <li><strong>Hero Section:</strong> Features the primary headline ("See exactly why you didn't get the interview"), product explanation, and "Start free scan" button.</li>
            <li><strong>Floating Preview Card:</strong> Interactive static score gauge preview (78/100 match score) showing sample matched and missing skill pills.</li>
            <li><strong>3-Step "How It Works" Section:</strong> Explains the 3 simple steps: Paste Resume → Paste Job Post → Get Scan Report.</li>
          </ul>
        </div>

        <div class="guide-section">
          <h3>🔍 2. Analyzer Input Page (Scanner — <code>/scan</code>)</h3>
          <p><strong>Purpose:</strong> Collects user resume text and target job description with instant feedback and file extraction.</p>
          <ul>
            <li><strong>1-Click Demo Presets:</strong> Pre-loaded sample buttons (Senior Frontend, Product Manager, Full Stack) so judges can test with a single click.</li>
            <li><strong>Resume Input Panel:</strong> Large textarea + drag-and-drop file upload zone supporting <code>.pdf</code>, <code>.docx</code>, and <code>.txt</code> text extraction.</li>
            <li><strong>Job Post Panel:</strong> Dedicated textarea for pasting target job descriptions.</li>
            <li><strong>Real-Time Keyword Ticker:</strong> Displays live count of overlapping technical skills as text is entered.</li>
            <li><strong>Inline Validation & Loading:</strong> Highlights empty fields in warm red-tan tone and pulses Warm Tan glowing borders during AI analysis.</li>
          </ul>
        </div>

        <div class="guide-section">
          <h3>📊 3. Results / Scan Report Page (Report — <code>/results</code>)</h3>
          <p><strong>Purpose:</strong> Displays comprehensive match scoring, ATS health checks, skill gap analysis, and AI bullet rewrites.</p>
          <ul>
            <li><strong>Animated Score Gauge:</strong> SVG arc and numeric counter smoothly tick up from 0 to the calculated score (0 → 82/100). Triggers confetti for scores ≥ 80.</li>
            <li><strong>AI Executive Summary:</strong> Prominently formatted sentence explaining match strengths and improvement areas.</li>
            <li><strong>ATS Health Checklist:</strong> 4-point audit evaluating Keyword Match, Layout Readability, Action Verb Strength, and Requirement Coverage.</li>
            <li><strong>Matched & Missing Skills:</strong> Visual Zoom Blue pills for matches and outlined pills with dashed icons for skill gaps.</li>
            <li><strong>AI Rewrite Suggestions:</strong> Strikethrough original bullet points paired with AI-improved metric rewrites and 1-click copy buttons.</li>
            <li><strong>Tailored Resume Exporter:</strong> Automatically merges improved bullets back into candidate text and downloads a clean <code>.txt</code> file.</li>
          </ul>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  modalOverlay.querySelector('#close-guide-modal').addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });
}

window.addEventListener('popstate', renderRoute);

document.addEventListener('DOMContentLoaded', () => {
  renderRoute();
});
