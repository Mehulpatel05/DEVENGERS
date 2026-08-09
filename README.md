# 📡 Signal — AI Resume & Job-Match Scanner

> **"See exactly why you didn't get the interview."**  
> Built for **Hack Devengers 1.0** — 100% Session-Only, Zero Authentication, Instant Web App.

---

## 🎨 Design System & Color Tokens

- **Zoom Blue (`#2D8CFF`)**: Primary buttons, CTA links, focus rings, high-score gauge fill.
- **Navy (`#0B132B`)**: Top navbar, footer banner, main page dark headings.
- **White (`#FFFFFF`)**: Clean main page background.
- **Soft Lavender (`#F3EEFC` / `#EAE4F5`)**: Card backgrounds, input borders, preview cards.
- **Warm Tan (`#D4A373`)**: Accent icons, score gauge highlight, pulsing scan borders.
- **Typography**: Geometric sans-serif (*Inter*, *Outfit*), rounded corners (`8-12px`), soft shadows.
- **Zero Authentication**: No login, no signup, no auth screens, no user tables.

---

## ✨ Features

- **🤖 Cohere AI Integration**: Powered by Cohere's `command-r-plus` model (`COHERE_API_KEY`) with fallback support for Anthropic Claude, Gemini, and offline smart analysis.
- **⚡ 1-Click Demo Presets**: Pre-loaded buttons on `/scan` (`Senior Frontend`, `Product Manager`, `Full Stack`) for instant 1-click scanning during demos.
- **📄 Client-Side File Extraction**: Drag-and-drop `.pdf`, `.docx`, and `.txt` files directly into the analyzer panel.
- **🔍 Live Keyword Ticker**: Real-time overlapping keyword counter badge above the submit button.
- **📊 Animated Score Gauge & Confetti**: SVG circular match gauge counts up smoothly from `0` to `82/100`, triggering a particle confetti burst for scores `≥ 80`.
- **📋 ATS Health Checklist**: 4-point compatibility audit checking Keyword Ratio, File Structure Readability, Action Verb Impact, and Requirement Coverage.
- **✏️ AI Bullet Rewrites & 1-Click Copy**: Strikethrough original bullet points paired with AI-improved quantified rewrites and individual copy buttons.
- **📥 Tailored Resume Exporter**: Merges improved bullets back into candidate resume text and exports a clean `.txt` file (`Tailored_Resume_Signal.txt`).
- **🛡️ Rate Limiting & Input Validation**: In-memory IP rate limiter (10 reqs/min) and friendly in-product error messaging (`"Paste your resume text to continue"`).

---

## 📂 Project Structure

```
.
├── README.md               # Complete Project Documentation & Deployment Guide
├── package.json            # Node.js manifest with npm start command
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore configuration
├── backend/
│   └── server.js           # REST API endpoint (/api/analyze) with Cohere LLM integration
└── public/
    ├── index.html          # Main HTML5 entry point
    ├── css/
    │   └── style.css       # Complete CSS Design Tokens & Layout System
    └── js/
        ├── app.js          # SPA Router & Global Guide Modal Controller
        ├── pages/
        │   ├── landing.js  # Screen 1: Landing Page (/)
        │   ├── analyzer.js # Screen 2: Input Analyzer Page (/scan)
        │   └── results.js  # Screen 3: Scan Report Page (/results)
        └── utils/
            ├── api.js      # API fetch client helper
            └── textExtractor.js # Client-side file drop text parser (.pdf/.docx/.txt)
```

---

## ⚡ Quick Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mehulpatel05/DEVENGERS.git
   cd DEVENGERS
   ```

2. **Set Environment Variables**:
   Create a `.env` file from `.env.example`:
   ```env
   PORT=5000
   COHERE_API_KEY=your_cohere_api_key_here
   ```
   *(Note: If no API key is set, Signal uses its built-in smart analyzer engine offline seamlessly!)*

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   ```
   http://localhost:5000
   ```

---

## 🚀 Deploying Backend & Frontend on Render (Step-by-Step)

Signal is structured as a unified Node.js service, making deployment on **Render** effortless in under 2 minutes:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Cohere API integration"
git push origin main
```

### Step 2: Create a New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your repository `https://github.com/Mehulpatel05/DEVENGERS`.
3. Configure the settings:
   - **Name**: `signal-ai-resume-scanner`
   - **Region**: Oregon (or closest to your audience)
   - **Branch**: `main`
   - **Root Directory**: `.` *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: *(leave blank or `npm install`)*
   - **Start Command**: `npm start`
4. **Environment Variables**:
   - Key: `COHERE_API_KEY`
   - Value: *(your Cohere API key)*
   *(Render automatically assigns the `PORT` variable).*
5. Click **Create Web Service**.

Once deployed, Render will provide a live URL (e.g. `https://signal-ai-resume-scanner.onrender.com`) running both the Cohere-powered backend REST API and the frontend SPA seamlessly!

---

## 🔌 API Reference

### `POST /api/analyze`

**Request Body**:
```json
{
  "resumeText": "Senior Frontend Developer with 5 years experience in React, TypeScript, Node.js...",
  "jobDescriptionText": "Seeking a Senior Frontend Engineer proficient in React, TypeScript, GraphQL, AWS..."
}
```

**Response (`200 OK`)**:
```json
{
  "matchScore": 82,
  "matchedSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["GraphQL", "AWS"],
  "weakBullets": [
    {
      "original": "Worked on backend microservices and databases",
      "improved": "Engineered high-throughput Node.js microservices, reducing database response latency by 35%"
    }
  ],
  "summary": "Strong match! Your resume demonstrates core competencies required for this position..."
}
```

---

## 📜 License
Built for **Hack Devengers 1.0**. Open source under the MIT License.
