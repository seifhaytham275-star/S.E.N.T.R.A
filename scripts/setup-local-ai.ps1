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

Write-Host "Checking Ollama runtime..." -ForegroundColor Cyan
try {
  ollama list | Out-Null
} catch {
  Write-Host "Could not contact Ollama. Start the Ollama app, then retry." -ForegroundColor Red
  exit 1
}

foreach ($model in $models) {
  Write-Host "Pulling $model ..." -ForegroundColor Cyan
  ollama pull $model
  if ($LASTEXITCODE -ne 0) { throw "Failed to download $model" }
}

Write-Host ""
Write-Host "All three SENTRA local models are installed." -ForegroundColor Green
Write-Host "Next: run scripts\\start-local-ai.ps1" -ForegroundColor Green
