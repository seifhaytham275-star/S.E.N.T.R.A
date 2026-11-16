import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SENTRA Local AI"
    environment: str = "local"
    cors_origins: str = "http://localhost:5173,https://seifhaytham275-star.github.io,capacitor://localhost,http://localhost"
    ollama_base_url: str = "http://127.0.0.1:11434"
    general_model: str = "qwen2.5:3b"
    coding_model: str = "qwen2.5-coder:3b"
    reasoning_model: str = "deepseek-r1:1.5b"
    model_config = SettingsConfigDict(env_prefix="SENTRA_", env_file=".env", extra="ignore")


settings = Settings()
MODELS = {
    "general": settings.general_model,
    "coding": settings.coding_model,
    "reasoning": settings.reasoning_model,
}
SYSTEM_PROMPT = (
    "You are SENTRA, a helpful private AI assistant. Be accurate, clear, and concise. "
    "You run locally. Never claim to have accessed files, websites, accounts, or performed "
    "actions unless a connected tool actually did so. Reply in the language used by the user."
)

app = FastAPI(title=settings.app_name, version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Request-ID"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)
    mode: str = Field(default="general", pattern="^(general|coding|reasoning)$")


async def ollama_get(path: str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        return await client.get(settings.ollama_base_url.rstrip("/") + path)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sentra-local-ai", "environment": settings.environment}


@app.get("/api/v1/models")
async def models() -> dict[str, object]:
    try:
        response = await ollama_get("/api/tags")
        response.raise_for_status()
        installed = {item.get("name") for item in response.json().get("models", [])}
        entries = [
            {"id": model_id, "mode": mode, "installed": model_id in installed}
            for mode, model_id in MODELS.items()
        ]
        return {"provider": "ollama-local", "connected": True, "models": entries,
                "ready": all(item["installed"] for item in entries)}
    except (httpx.HTTPError, ValueError):
        return {"provider": "ollama-local", "connected": False, "models": [
            {"id": model_id, "mode": mode, "installed": False}
            for mode, model_id in MODELS.items()
        ], "ready": False}


@app.get("/api/v1/status")
async def status() -> dict[str, object]:
    model_status = await models()
    return {
        "name": "SENTRA",
        "version": "0.3.0",
        "stage": "local-ai-foundation",
        "provider": "Ollama (local)",
        "api_keys_required": False,
        "ai_configured": bool(model_status["connected"]),
        "ai_ready": bool(model_status["ready"]),
        "capabilities": {
            "local_ai_service": True,
            "three_local_models": bool(model_status["ready"]),
            "memory": False,
            "gmail": False,
            "youtube": False,
            "browser": False,
            "voice": False,
            "files": False,
            "developer_tools": False,
        },
        "models": model_status["models"],
    }


@app.post("/api/v1/chat")
async def chat(payload: ChatRequest) -> dict[str, str]:
    model_id = MODELS[payload.mode]
    model_status = await models()
    if not model_status["connected"]:
        raise HTTPException(status_code=503, detail="Ollama is not running on this Windows device.")
    if not any(item["id"] == model_id and item["installed"] for item in model_status["models"]):
        raise HTTPException(status_code=503, detail=f"Local model '{model_id}' is not installed yet. Run scripts\\setup-local-ai.ps1.")
    body = {
        "model": model_id,
        "stream": False,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": payload.message},
        ],
        "options": {"temperature": 0.4},
    }
    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(settings.ollama_base_url.rstrip("/") + "/api/chat", json=body)
            response.raise_for_status()
            data = response.json()
            reply = data.get("message", {}).get("content", "")
            if not isinstance(reply, str) or not reply.strip():
                raise ValueError("Ollama returned an empty response.")
            return {"reply": reply.strip(), "model": model_id, "mode": payload.mode, "provider": "ollama-local"}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"Local model runtime returned HTTP {exc.response.status_code}.") from exc
    except (httpx.HTTPError, ValueError):
        raise HTTPException(status_code=502, detail="SENTRA could not get a valid response from the local model.")
