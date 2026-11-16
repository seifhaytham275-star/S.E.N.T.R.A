# SENTRA

Original personal AI system for Web, Windows, and Android.

Status: Phase 1 foundation. Integrations are not active until credentials are configured and end-to-end tests pass.

See `docs/architecture.md` for architecture and `docs/roadmap.md` for milestones.

## Current scaffold

The repository currently contains the initial responsive React/Vite UI, a FastAPI health/status service, environment-variable templates, architecture and roadmap documents, and a GitHub Actions workflow. The chat box is a UI preview only; no AI provider is connected. Gmail, YouTube, browser, memory, voice, file processing, and developer integrations are not implemented yet.

## Run the web app

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Run the API

Requirements: Python 3.11 or newer.

```bash
cd services/api
python -m venv .venv
# Activate the environment, then:
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The web UI is available at `http://localhost:5173`; the API health endpoint is `http://localhost:8000/health`.
