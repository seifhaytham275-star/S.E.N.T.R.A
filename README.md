# SENTRA

**An original personal AI workspace.** Project founder: Seif Haytham.

SENTRA targets Web first, with Windows and Android packaging planned after the web experience and API are stable.

## MVP v0.1 status

- Responsive dark SENTRA workspace UI.
- Navigation for Workspace, Memory Center, Integrations, Files, and Settings.
- Conversation composer and browser-local conversation history.
- API connection/status indicator.
- FastAPI service foundation with health and capability endpoints.
- GitHub Actions CI and GitHub Pages deployment workflow.

**Important:** The web UI and API foundation are implemented. The local AI Core uses Ollama on the Windows host and requires no Gemini/OpenAI account or API key. Three local models are supported: `qwen2.5:3b` (general), `qwen2.5-coder:3b` (coding), and `deepseek-r1:1.5b` (reasoning). They must be downloaded and run on the Windows host before chat is ready. Gmail, YouTube, browser automation, persistent memory, voice, file analysis, and developer integrations are not active yet.

## Run the web app locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Build and type-check:

```bash
npm run typecheck
npm run build
```

## Run the API locally

Requirements: Python 3.11+.

```bash
cd services/api
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health: `http://localhost:8000/health`.

## Publish the web MVP with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions**, allow workflows if GitHub asks, then run **SENTRA Web Deploy** (or push to `main`).
4. When the workflow succeeds, open **Settings → Pages** to find the live URL. The expected URL is `https://seifhaytham275-star.github.io/S.E.N.T.R.A/`.

The GitHub Pages site hosts the static web client. It does not host the local models or Python API. For a no-API-key setup, install Ollama and run the local Windows AI service below. When the web page is opened on that same Windows computer, it connects to `http://127.0.0.1:8000` by default. A remotely opened Pages website cannot reach a Windows computer that is not on the same device/network; remote-device access needs a separately secured LAN connection.

## Project architecture

See `docs/architecture.md` and `docs/roadmap.md`.


## Native apps (Windows + Android)

The web workspace is shared by the native shells so features remain consistent.

### Windows installer
```bash
npm install
npm run build
npx electron-builder --win nsis
```
The installer is written to `dist-native/`. The GitHub Actions workflow also builds it automatically and uploads it as the `SENTRA-Windows` artifact.

### Android APK
Requirements: Node.js 22, JDK 21, Android SDK and platform tools.
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```
APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.
The GitHub Actions workflow generates the Android project on the runner and uploads the debug APK as `SENTRA-Android-debug`.

These are installable development builds, not Play Store / production-signed releases. A production Android release needs a private signing key and protected CI secrets. Never commit signing keys or AI provider keys.

### Native build downloads
Open the repository's Actions tab, select the latest successful **SENTRA Native Builds** run, and download either artifact. Artifacts expire after 14 days; create a GitHub Release for durable distribution.
\n\n## Local AI Core (Windows, no API keys)\n\nRequirements: Windows 10/11, Ollama for Windows, Python 3.11+, and enough RAM/disk space for the selected models. The three starter models require several GB of downloads and memory; performance depends on your hardware.\n\n1. Install Ollama from [ollama.com/download/windows](https://ollama.com/download/windows).\n2. In PowerShell at the repository root, run `powershell -ExecutionPolicy Bypass -File .\\scripts\\setup-local-ai.ps1` to download the three models.\n3. Run `powershell -ExecutionPolicy Bypass -File .\\scripts\\start-local-ai.ps1` to start the local API.\n4. Open the SENTRA web app on the same Windows computer. Select General, Code, or Reasoning in the chat composer.\n5. Check `http://127.0.0.1:8000/api/v1/status` and `/api/v1/models` to inspect readiness.\n\nThe API binds to loopback (`127.0.0.1`) by default and does not expose the model runtime to the network. The hosted web client calls this local service from the same computer. For Android or another device, do not expose the local API directly to the public internet; a separate authenticated, encrypted LAN pairing flow is required.\n