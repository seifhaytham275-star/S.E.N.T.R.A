$ErrorActionPreference = "Stop"

$models = @(
  "qwen2.5:3b",
  "qwen2.5-coder:3b",
  "deepseek-r1:1.5b"
)

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "Ollama was not found. Install Ollama for Windows from https://ollama.com/download/windows and run this script again." -ForegroundColor Yellow
  exit 1
}

Write-Host "Checking local Ollama service..." -ForegroundColor Cyan
try {
  Invoke-RestMethod "http://127.0.0.1:11434/api/tags" -TimeoutSec 3 | Out-Null
} catch {
  Write-Host "Starting the Ollama local service..." -ForegroundColor Cyan
  Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
  $ready = $false
  for ($attempt = 0; $attempt -lt 15; $attempt++) {
    Start-Sleep -Seconds 2
    try {
      Invoke-RestMethod "http://127.0.0.1:11434/api/tags" -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {}
  }
  if (-not $ready) { throw "Ollama did not start. Open the Ollama app and retry." }
}

foreach ($model in $models) {
  Write-Host "Downloading $model ..." -ForegroundColor Cyan
  & ollama pull $model
  if ($LASTEXITCODE -ne 0) { throw "Failed to download $model" }
}

Write-Host ""
Write-Host "All three SENTRA local models are installed." -ForegroundColor Green
Write-Host "Next: run scripts\\start-local-ai.ps1" -ForegroundColor Green
