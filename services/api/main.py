from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SENTRA API",
    version="0.1.0",
    description="Backend foundation for the SENTRA personal AI system.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "sentra-api", "version": "0.1.0"}

@app.get("/api/v1")
async def api_root():
    return {
        "name": "SENTRA",
        "status": "foundation",
        "message": "AI provider and integrations are not configured yet.",
    }
