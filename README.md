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

**Important:** MVP v0.1 is a functional web interface, not a fully connected AI assistant. AI replies require a deployed backend and a server-side provider key. Gmail, YouTube, browser automation, persistent cloud memory, voice, file analysis, and developer integrations are not active yet. The interface reports unavailable services honestly and does not simulate successful integrations.

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

The GitHub Pages site hosts the static web client. It does not host the Python API. To activate AI chat, deploy `services/api` to a Python hosting service and set `VITE_API_BASE_URL` as a GitHub Actions repository variable to that API's public HTTPS URL, then rerun the deploy workflow. Configure provider credentials only as backend secrets/environment variables; never add them to the frontend or repository.

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
