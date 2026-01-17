# 🤖 AI Code Plagiarism Detector

A small web app that analyzes source code and estimates how likely it is to be AI-generated. The app visualizes an "AI percentage" in a circular chart and streams human-readable analysis results as they are generated.

This repo contains the frontend (Vite + React) and utilities for interacting with a backend analysis service.

Key features
- AI-percentage visual (circular chart)
- Streaming analysis output (progressive text like ChatGPT)
- Simple code editor input and history sidebar

## Quick demo
1. Open the frontend in your browser (after starting the dev server).  
2. Paste or type code into the editor.  
3. The AI-percentage and streaming analysis update in real time.

## Contents
- `index.html` — app entry HTML
- `package.json` — frontend project manifest
- `src/` — main frontend source
  - `App.jsx`, `main.jsx` — entry & boot
  - `index.css` — styles
  - `components/` — UI components (Editor, Header, Sidebar, Report, etc.)
  - `utils/analysis.js` — client-side helpers for analysis streaming
  - `utils/pdfGenerator.js` — export report helpers

## Local setup (frontend)
This project uses npm and Vite for the frontend. From the repo root:

```bash
# install dependencies
npm install

# run the dev server (Vite)
npm run dev
```

Open the URL that Vite prints (usually `http://localhost:5173`). The UI will load and you can paste code into the editor.

## Backend note
This repo assumes a separate backend analysis service (Node/Express) that exposes an API endpoint the frontend calls to run code analysis and stream results. The original README mentioned `script.js` pointing to a Render backend URL — update the API base URL in the frontend if your backend runs at a different host.

If you have the backend source and want to run it locally, typical commands are:

```bash
# from the backend directory (if separate)
npm install
node index.js
```

Then update the frontend API URL (where the frontend sends code for analysis) to point to `http://localhost:<PORT>`.

## Configuration pointers
- API endpoint: ensure the frontend points to your analysis backend. Look for the file that contains the backend URL (example: `src/utils/analysis.js` or a `script.js` referenced in `index.html`) and update it.
- Environment: if the backend requires API keys or ENV values, provide them locally per the backend README (not included here).

## Running a production build
To build the frontend for production:

```bash
npm run build
```

You can then host the generated `dist/` with any static host (Vercel, Netlify, GitHub Pages, etc.). If you deploy the frontend, update the deployed frontend's backend URL to the production backend endpoint.

## Project structure (short)

```
.
├─ index.html
├─ package.json
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  ├─ components/
│  │  ├─ CodeEditor.jsx
│  │  ├─ AnalysisReport.jsx
│  │  ├─ HistorySidebar.jsx
│  │  └─ ...
│  └─ utils/
│     ├─ analysis.js
│     └─ pdfGenerator.js
```

## Contributing
- Fork the repository and create a feature branch.
- Open a pull request with a clear description of the change.

Small, safe improvements I recommend:
- Add instructions or environment templates for the backend if you include it in the repo.
- Add tests for `utils/analysis.js` (unit tests for parsing/formatting streaming messages).

## Troubleshooting
- If the analysis stream doesn't start, verify the frontend's API URL and that the backend is running and accessible.
- Open the browser console / network tab to inspect requests and SSE/Fetch streaming responses.

## Developed BY : Piyush Ranakoti 🧠

---

