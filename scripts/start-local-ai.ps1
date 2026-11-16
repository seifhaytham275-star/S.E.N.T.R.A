$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$api = Join-Path $root "services\\api"

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama is not installed. Run scripts\\setup-local-ai.ps1 after installing Ollama."
}

try {
  Invoke-RestMethod "http://127.0.0.1:11434/api/tags" -TimeoutSec 3 | Out-Null
} catch {
  Write-Host "Starting Ollama..." -ForegroundColor Cyan
  Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
  Start-Sleep -Seconds 3
}

if (-not (Test-Path (Join-Path $api ".venv"))) {
  py -3 -m venv (Join-Path $api ".venv")
}
$python = Join-Path $api ".venv\\Scripts\\python.exe"
& $python -m pip install -r (Join-Path $api "requirements.txt")
Push-Location $api
try {
  & $python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
} finally {
  Pop-Location
}
