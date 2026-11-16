# SENTRA Architecture

## Product targets
SENTRA is one product delivered as a responsive web app, a Windows desktop app, and an Android app. The UI and domain contracts are shared; privileged capabilities remain behind the backend or narrow platform adapters.

## Initial stack
- Web UI: React, TypeScript, Vite.
- API: Python, FastAPI, Pydantic.
- Desktop: Tauri 2 wrapper around the built web client (later milestone).
- Android: Capacitor wrapper around the built web client (later milestone).
- Persistence: PostgreSQL for durable accounts, conversations, settings, and consent records.
- Optional semantic memory: pgvector after explicit user-controlled memory requirements are implemented.
- AI providers: backend-only adapters behind a provider-neutral interface.

## Logical boundaries
1. Client applications: presentation, accessible interactions, local preferences, API client.
2. API gateway: versioned HTTP endpoints, request validation, authentication boundary, rate limiting.
3. AI core: orchestration, provider selection, policy checks, tool routing, response normalization.
4. Memory service: explicit opt-in capture, inspect/update/delete, provenance and timestamps.
5. Integrations: Gmail, YouTube, GitHub, and browser capabilities, each isolated behind adapters and least-privilege scopes.
6. Data layer: PostgreSQL; object storage for user files; short-lived cache only where justified.
7. Security/audit: secret management, consent checks, sensitive-action confirmations, redacted audit events.

## Trust and safety boundaries
- Never ship provider keys, OAuth client secrets, or access tokens to browser/mobile bundles.
- Treat uploaded files, webpages, email bodies, transcripts, and repository content as untrusted data.
- External content cannot override system policies or authorize actions.
- Require explicit confirmation before sending email, deleting/modifying remote data, publishing code, or performing other irreversible actions.
- Memory is user-controlled: no sensitive memory by default; provide review, correction, export, and deletion.
- Request the minimum OAuth scopes for each feature and make disconnect/revocation available.
- Keep logs free of secrets and unnecessary personal content.

## API conventions
- Prefix endpoints with /api/v1.
- Use Pydantic request/response models.
- Return structured errors and request IDs.
- Keep provider-specific payloads out of frontend contracts.
- Health endpoint: GET /health.

## Initial implementation boundary
The first commit provides a runnable UI shell and a small API health endpoint. AI chat, authentication, persistence, integrations, voice, and platform packaging are planned and must not be represented as active until implemented and tested.
