# SENTRA Roadmap

## Phase 1 — Discovery and architecture
- [x] Confirm Web, Windows, and Android targets.
- [x] Establish monorepo boundaries and initial architecture.
- [ ] Confirm runtime constraints and deployment preferences.
- [ ] Add architecture decision records as choices become final.

## Phase 2 — Identity and UI
- [x] Create initial SENTRA visual shell.
- [ ] Responsive navigation and accessibility review.
- [ ] Conversation workspace and integration status views.
- [ ] Design tokens and component tests.

## Phase 3 — AI Core
- [ ] Provider-neutral model interface.
- [ ] Secure server-side provider configuration.
- [ ] Model routing, streaming, quotas, and error handling.
- [ ] Evaluation and regression tests.

## Phase 4 — Personal Memory
- [ ] Explicit opt-in capture.
- [ ] Memory review, edit, export, and delete.
- [ ] Provenance, retention, and privacy controls.

## Phase 5 — Gmail
- [ ] Google Cloud OAuth setup and minimum scopes.
- [ ] Read/search/list messages.
- [ ] Draft creation.
- [ ] Send only after explicit confirmation.
- [ ] End-to-end tests with a test account.

## Phase 6 — YouTube
- [ ] YouTube Data API search and channel/video metadata.
- [ ] Open selected video links.
- [ ] Transcript-based analysis only when a lawful transcript is available.
- [ ] Do not claim to watch inaccessible video content.

## Phase 7 — Browser
- [ ] Safe browsing and page extraction.
- [ ] Isolated browser session and domain controls.
- [ ] Confirmation for sensitive page actions.

## Phase 8 — Voice
- [ ] Arabic and English speech-to-text.
- [ ] Text-to-speech and voice preferences.
- [ ] Consent and microphone indicators.

## Phase 9 — Files and data
- [ ] PDF, DOCX, XLSX, CSV, TXT, code, and image ingestion.
- [ ] Sandboxed parsing and size/type limits.
- [ ] Data analysis and chart generation.

## Phase 10 — Developer tools
- [ ] Repository browsing and code review.
- [ ] GitHub OAuth with least privilege.
- [ ] Safe command execution isolation.
- [ ] CI workflows and diagnostics.

## Phase 11 — Security and testing
- [ ] Threat model and privacy review.
- [ ] Unit, integration, E2E, dependency, and secret scanning.
- [ ] Rate limiting, backups, and recovery drills.

## Phase 12 — Release
- [ ] Web deployment.
- [ ] Signed Windows build.
- [ ] Android APK build and device testing.
- [ ] Release notes, README, and operational runbooks.

## Release rule
A feature is complete only after implementation, automated tests, manual verification where needed, and documented configuration. Credentials and external approvals are tracked as blockers, not simulated.
