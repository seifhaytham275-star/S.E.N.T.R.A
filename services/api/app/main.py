from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SENTRA API"
    environment: str = "development"
    cors_origins: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_prefix="SENTRA_", extra="ignore")


settings = Settings()
app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sentra-api", "environment": settings.environment}


@app.get("/api/v1/status")
async def status() -> dict[str, object]:
    return {
        "name": "SENTRA",
        "version": "0.1.0",
        "stage": "foundation",
        "capabilities": {
            "api_health": True,
            "ai_chat": False,
            "memory": False,
            "gmail": False,
            "youtube": False,
            "browser": False,
            "voice": False,
            "files": False,
            "developer_tools": False,
        },
    }
