import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SENTRA API"
    environment: str = "development"
    cors_origins: str = "http://localhost:5173"
    ai_api_key: str = ""
    ai_base_url: str = "https://api.openai.com/v1"
    ai_model: str = "gpt-4o-mini"
    model_config = SettingsConfigDict(env_prefix="SENTRA_", env_file=".env", extra="ignore")


settings = Settings()
app = FastAPI(title=settings.app_name, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sentra-api", "environment": settings.environment}


@app.get("/api/v1/status")
async def status() -> dict[str, object]:
    return {
        "name": "SENTRA",
        "version": "0.1.0",
        "stage": "mvp",
        "ai_configured": bool(settings.ai_api_key),
        "capabilities": {
            "api_health": True,
            "ai_chat": bool(settings.ai_api_key),
            "memory": False,
            "gmail": False,
            "youtube": False,
            "browser": False,
            "voice": False,
            "files": False,
            "developer_tools": False,
        },
    }


@app.post("/api/v1/chat")
async def chat(payload: ChatRequest) -> dict[str, str]:
    if not settings.ai_api_key:
        raise HTTPException(status_code=503, detail="AI provider credentials are not configured on the SENTRA server.")
    endpoint = settings.ai_base_url.rstrip("/") + "/chat/completions"
    headers = {"Authorization": f"Bearer {settings.ai_api_key}", "Content-Type": "application/json"}
    body = {
        "model": settings.ai_model,
        "messages": [
            {"role": "system", "content": "You are SENTRA, an original, careful, helpful personal AI assistant. Be clear about limitations. Never claim to have used an integration or taken an action unless it actually happened."},
            {"role": "user", "content": payload.message},
        ],
        "temperature": 0.5,
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(endpoint, headers=headers, json=body)
            response.raise_for_status()
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            if not isinstance(reply, str) or not reply.strip():
                raise ValueError("Provider returned an empty response.")
            return {"reply": reply, "model": settings.ai_model}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"AI provider returned HTTP {exc.response.status_code}.") from exc
    except (httpx.HTTPError, KeyError, IndexError, ValueError):
        raise HTTPException(status_code=502, detail="SENTRA could not obtain a valid response from the AI provider.")
