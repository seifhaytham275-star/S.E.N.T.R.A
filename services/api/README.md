# SENTRA API

Initial FastAPI service.

## Run locally
```bash
python -m venv .venv
# Activate the virtual environment, then:
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Health: http://localhost:8000/health
- Status: http://localhost:8000/api/v1/status

This is a foundation service only. Authentication, database persistence, AI providers, and external integrations are not enabled yet.
