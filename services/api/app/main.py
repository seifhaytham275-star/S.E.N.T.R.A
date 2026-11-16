import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SENTRA AI Core"
    environment: str = "local"
    cors_origins: str = "http://localhost:5173,https://seifhaytham275-star.github.io,capacitor://localhost,http://localhost"
    ollama_base_url: str = "http://127.0.0.1:11434"
    general_model: str = "qwen2.5:3b"
    coding_model: str = "qwen2.5-coder:3b"
    reasoning_model: str = "deepseek-r1:1.5b"
    gemini_model: str = "gemini-3.8-flash"
    model_config = SettingsConfigDict(env_prefix="SENTRA_", env_file=".env", extra="ignore")


settings = Settings()
LOCAL_MODELS = {
    "general": settings.general_model,
    "coding": settings.coding_model,
    "reasoning": settings.reasoning_model,
}
SYSTEM_PROMPT = (
    "You are SENTRA, a helpful personal AI assistant. Be accurate, clear, and concise. "
    "Never claim to have accessed files, websites, accounts, or performed actions unless "
    "a connected tool actually did so. Reply in the language used by the user."
)

app = FastAPI(title=settings.app_name, version="0.4.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Request-ID", "X-Goog-Api-Key"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=12000)
    provider: str = Field(default="local", pattern="^(local|gemini)$")
    mode: str = Field(default="general", pattern="^(general|coding|reasoning)$")


async def ollama_get(path: str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        return await client.get(settings.ollama_base_url.rstrip("/") + path)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sentra-ai-core", "environment": settings.environment}


@app.get("/api/v1/models")
async def models() -> dict[str, object]:
    try:
        response = await ollama_get("/api/tags")
        response.raise_for_status()
        installed = {item.get("name") for item in response.json().get("models", [])}
        entries = [{"id": model_id, "mode": mode, "installed": model_id in installed}
                   for mode, model_id in LOCAL_MODELS.items()]
        return {"provider": "ollama-local", "connected": True, "models": entries,
                "ready": all(item["installed"] for item in entries)}
    except (httpx.HTTPError, ValueError):
        return {"provider": "ollama-local", "connected": False, "models": [
            {"id": model_id, "mode": mode, "installed": False}
            for mode, model_id in LOCAL_MODELS.items()
        ], "ready": False}


@app.get("/api/v1/status")
async def status() -> dict[str, object]:
    model_status = await models()
    return {
        "name": "SENTRA",
        "version": "0.4.0",
        "stage": "dual-provider-ai-core",
        "provider": "Ollama local or Gemini per request",
        "api_keys_required": False,
        "ai_configured": bool(model_status["connected"]),
        "ai_ready": bool(model_status["ready"]),
        "capabilities": {
            "local_ai_service": True,
            "three_local_models": bool(model_status["ready"]),
            "gemini_provider": True,
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
async def chat(payload: ChatRequest, x_goog_api_key: str | None = Header(default=None)) -> dict[str, str]:
    if payload.provider == "gemini":
        if not x_goog_api_key or len(x_goog_api_key) < 12:
            raise HTTPException(status_code=400, detail="Enter your Gemini API key in Settings.")
        body = {
            "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
            "contents": [{"role": "user", "parts": [{"text": payload.message}]}],
            "generationConfig": {"temperature": 0.4},
        }
        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent",
                    headers={"x-goog-api-key": x_goog_api_key, "Content-Type": "application/json"},
                    json=body,
                )
                if response.status_code in (400, 401, 403):
                    raise HTTPException(status_code=502, detail="Gemini rejected this key or request. Check the key and its API restrictions in Google AI Studio.")
                response.raise_for_status()
                data = response.json()
                reply = "".join(part.get("text", "") for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []))
                if not reply.strip():
                    raise ValueError("Gemini returned no text.")
                return {"reply": reply.strip(), "model": settings.gemini_model, "mode": payload.mode, "provider": "gemini"}
        except HTTPException:
            raise
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail="Could not reach Gemini. Check your internet connection and try again.") from exc
        except (ValueError, IndexError, KeyError, TypeError):
            raise HTTPException(status_code=502, detail="Gemini returned an unexpected response.") from None

    model_id = LOCAL_MODELS[payload.mode]
    model_status = await models()
    if not model_status["connected"]:
        raise HTTPException(status_code=503, detail="Ollama is not running on this Windows device.")
    if not any(item["id"] == model_id and item["installed"] for item in model_status["models"]):
        raise HTTPException(status_code=503, detail=f"Local model '{model_id}' is not installed yet. Run scripts\\setup-local-ai.ps1.")
    body = {"model": model_id, "stream": False, "messages": [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": payload.message},
    ], "options": {"temperature": 0.4}}
    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(settings.ollama_base_url.rstrip("/") + "/api/chat", json=body)
            response.raise_for_status()
            reply = response.json().get("message", {}).get("content", "")
            if not isinstance(reply, str) or not reply.strip():
                raise ValueError("Ollama returned an empty response.")
            return {"reply": reply.strip(), "model": model_id, "mode": payload.mode, "provider": "ollama-local"}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"Local model runtime returned HTTP {exc.response.status_code}.") from exc
    except (httpx.HTTPError, ValueError):
        raise HTTPException(status_code=502, detail="SENTRA could not get a valid response from the local model.") from None
