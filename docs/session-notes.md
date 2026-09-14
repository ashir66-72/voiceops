# VoiceOps — Session Notes

Notes from each AI-assisted working session.
Purpose: recover context quickly if a session is cut short.

---

## Session 2026-09-09 — Foundation + Environment

### Goal


### Decisions Made
- Python 3.13.2 chosen over 3.10 (installed versions: 3.14, 3.13, 3.10)
- Docker verified available (version 29.7.2)
- PostgreSQL 18 already installed locally but not in PATH
- Docker will be used for PostgreSQL (isolated, clean, repeatable)


### What Got Built
- docs/ folder
- increment-log.md
- session-notes.md
- Python 3.13.2 venv


### What Was Verified
- `py --list` shows 3.14, 3.13, 3.10
- `python --version` in venv prints 3.13.2


### Blockers Hit


### Next Session


---

## Session Template (copy for each new session)

## Session YYYY-MM-DD — [Short Title]

### Goal
-

### Decisions Made
-

### What Got Built
-

### What Was Verified
-

### Blockers Hit
-

### Next Session
-






















## Session 2026-09-11 — PostgreSQL Running + Connection Verified

### Goal
- Get PostgreSQL running
- Verify a database connection from Python
- Implement business_snapshot, find_customer, overdue_payments, best_sellers as FastAPI endpoints
- Build and run deterministic seed data per ADR-009 / MASTER_SPEC §8

### Decisions Made
- Used Docker (per ADR-002 / ADR-007) instead of the pre-installed local Postgres 18
- Remapped Docker container to host port 5433 instead of 5432 — local Postgres 18 service was already bound to 5432 and caused a silent password-auth conflict, not an actual credential error
- `voiceops` database created via `POSTGRES_DB` env var at container start, no manual DB creation step needed
- Truncate-and-restart pattern: script wipes all 7 tables + resets ID sequences before every insert, so reruns never duplicate data
- Fixed anchor date (2026-09-11) used for all relative date math, not `datetime.now()`, so overdue/pending status never drifts with the calendar
- Payments split into three explicit states: paid (20), overdue (6, past due date), pending (4, future due date) — matches decision to distinguish overdue from pending rather than one flat "unpaid" status
- Product order patterns rigged so Chicken Biryani appears in 4/6 shopping patterns, guaranteeing a clear, repeatable best-seller result
- All six tools kept in a single `backend/tools.py` file rather than a `tools/` package — appropriate at six-tool scale, revisit only if tool count grows significantly
- Business logic separated from HTTP routes: `tools.py` functions take a `Session` and return plain dicts, `main.py` routes are thin wrappers — keeps route layer dumb and logic layer testable independent of FastAPI
- Shared `get_db()` dependency added to `database.py` instead of repeating session open/close in every route

### What Got Built
- Docker container `voiceops-pg` (postgres:18), port 5433 → 5432
- `.env` file with `DATABASE_URL`
- `test_db_connection.py` — minimal SQLAlchemy connection proof
backend/` package: `__init__.py`, `database.py`, `main.py`
- `/health` GET endpoint returning API + DB status in one response
- `backend/models.py` — 7 SQLAlchemy ORM models with relationships
- `Base = declarative_base()` added to `backend/database.py`
- `create_tables.py` — one-off script to issue CREATE TABLE from models
- `seed_data.py` — full seed script using SQLAlchemy session, `flush()` mid-transaction for FK integrity, single `commit()` at the end
- `backend/tools.py` — four query functions using SQLAlchemy Core aggregates (`func.sum`, `func.coalesce`) and joins
- `backend/database.py` — added `get_db()` generator for FastAPI's `Depends()`
- `backend/main.py` — four new GET routes under `/tools/`, `/health` unchanged

### What Was Verified
- `docker ps` shows `voiceops-pg` Up
- `netstat -ano | findstr :5432` confirmed a competing local listener, explaining the first connection failure
- `python test_db_connection.py` returned `Connection successful. Result: (1,)` after pointing `.env` at port 5433

- `uvicorn backend.main:app --reload` starts clean, no errors
- `GET /health` returns `200 OK` with `{"status":"ok","database":"connected"}`
- Docker is installed and working
- `python create_tables.py` ran clean, no errors
- `docker exec -it voiceops-pg psql -U postgres -d voiceops -c "\dt"` confirmed all 7 tables exist in Postgre
- `python seed_data.py` ran clean: "10 customers, 6 products, 30 orders, 55 order_items, 30 payments"
- Row counts confirmed via SQL: customers=10, products=6, orders=30, order_items=55, payments=30
- Payment status breakdown confirmed: overdue=6, pending=4, paid=20
- Best-seller query confirmed: Chicken Biryani=35, next closest=10

### Blockers Hit























## Session 2026-09-12 — Write Tools Complete (add_note, send_payment_reminder)

### Goal
- Implement add_note and send_payment_reminder per MASTER_SPEC §10 write-action rule
- Verify success and failure paths for both
- Register the six MASTER_SPEC tools with a stored AssemblyAI agent
- Prove at least one full voice → tool → database → voice round trip actually works
- Close the one remaining gap from last session: verify add_note works end-to-end by voice
- Confirm write-tool confirmation flow behaves correctly for both write tools
- Add the two backend pieces the React dashboard will depend on: a proper token-minting route per ARCHITECTURE.md §4, and a read endpoint for the activity log per §8

### Decisions Made
- Writes use POST, reads use GET — POST can't be triggered accidentally (browser prefetch, link bots), which matters for state-changing actions
- Request validation moved to Pydantic models (`backend/schemas.py`) rather than manual checks in route functions — invalid JSON shape is rejected before it reaches business logic
- `send_payment_reminder` only accepts payments with status `overdue` or `pending` — rejects `paid` payments with a 400, since reminding on a settled payment is a logic error, not a valid action
- Response for `send_payment_reminder` explicitly includes a "simulated" disclosure string per ADR-006 — prevents the AssemblyAI agent from ever being able to claim a real message was sent
- Confirmation-before-write (per MASTER_SPEC §10) is a conversation-level responsibility for the AssemblyAI agent, not something enforced in the backend — backend's job is strict validation + audit logging, not conversational flow control
- Used AssemblyAI's REST API (`POST /v1/agents`) to create the stored agent, per current docs — dashboard "Agent" section is a separate AI code-assist tool, not where tool config lives
- `headers` on HTTP tools must be a list of `{name, value}` objects, not a flat dict — corrected before writing the real config
- ngrok-skip-browser-warning header added to every tool's HTTP config, since AssemblyAI's cloud calling the tunnel hits the same free-tier interstitial a normal script would
- Used the already-cloned official `assemblyai-starter` (Python) repo's `import_agent.py` + `deployment/browser/server.py` for live testing instead of writing a custom WebSocket client — matches ARCHITECTURE.md's intended browser-token flow without reinventing it
- Header values are write-only and don't round-trip through `import_agent.py` — the locally exported `.jsonc` file has a blank placeholder; the live agent still has the real value from creation. Do not run `publish.py` on the exported file until the header value is restored, or it will overwrite the working
- Confirmed find_customer's exact-substring matching is working as designed (not a bug) — "Ahmad" correctly fails to match "Ahmed" in the database, agent correctly reports not found instead of guessing
- No code changes made this session — this was a pure verification/testing session live config with a blank one

### What Got Built
- `backend/schemas.py` — AddNoteRequest, SendPaymentReminderRequest
- `add_note()` and `send_payment_reminder()` in `backend/tools.py`, both writing to `activity_log` on 
- Nothing new — this session was entirely testing against the existing six toolssuccess
- `POST /tools/add_note`, `POST /tools/send_payment_reminder` in `backend/main.py`
- `backend/register_agent.py` — creates the stored agent with all six tools wired to the FastAPI backend
- `agents/voiceops-urban-bites.jsonc` — local snapshot of the agent config (headers incomplete, do not publish as-is)
- Token minting moved into FastAPI (`/api/voice-token`) instead of relying on the starter's standalone `server.py` — matches the documented architecture where FastAPI is the trusted boundary, not a second ad hoc server
- `/tools/activity_log` treated as a dashboard-facing endpoint, not a seventh voice tool — it's never registered with AssemblyAI, so it doesn't conflict with ADR-005's six-tool freeze
- Plan going forward: reuse `assemblyai-starter/deployment/browser/app.js`'s audio engine (worklets, WebSocket handling) inside the new React app rather than rewriting proven code; do not reuse `server.py` itself
- `GET /api/voice-token` in `backend/main.py` — calls AssemblyAI's `/v1/token` server-side, returns a 60-second token to the browser
- `GET /tools/activity_log` in `backend/main.py` + `recent_activity()` in `backend/tools.py`

### What Was Verified
- `add_note` success: note created for Ahmed Khan (customer_id 1), returned note_id 2
- `add_note` failure: customer_id 9999 → 404 with clear error message
- `send_payment_reminder` success: payment_id 26 (Hina Riaz, overdue) → 200, reminder_sent_at set, "simulated" note present
- `send_payment_reminder` failure: payment_id 1 (already paid) → 400, correct rejection reason
- `send_payment_reminder` failure: payment_id 9999 (nonexistent) → 404
- Agent created successfully: `agent_id = agent_bed2d6e92dfc45e6b20688d91a674884`
- Live browser voice test via `localhost:3000` (assemblyai-starter): asked "give me today's business summary" → `business_snapshot` tool fired → agent spoke back 10 customers, 30 orders, $502.50 revenue, 6 overdue payments totaling $100.50 — exact match to seeded data
- Asked "what was the best-selling product" → `best_sellers` tool fired → agent correctly answered Chicken Biryani
- Noticeable latency (~230ms+ per ngrok hop, plus full tool round trip) attributed to ngrok free tier + cross-region distance to AssemblyAI servers, not application logic
- add_note called twice via voice, both times only after explicit user confirmation ("Is that okay?" → "Yeah, it's okay" / confirmed before execution)
- SQL verification: `activity_log` shows two real `note_added` entries (ids 7, 8) for Ahmed Khan (customer_id 1), content matching exactly what was dictated by voice
- All six tools from ADR-005 now confirmed working through the full voice → AssemblyAI → FastAPI → PostgreSQL → spoken response loop
- Confirmation-before-write behavior (MASTER_SPEC §10) verified working correctly for both add_note and send_payment_reminder without needing to hardcode it in the backend — the system_prompt instruction is sufficient
- `/tools/activity_log` returned real recent entries (note_added, payment_reminder) on first try
- `/api/voice-token` initially failed with 502; added temporary debug logging, found the real cause via AssemblyAI's own error body (422, missing `expires_in_seconds`), fixed, confirmed 200 with a real token, then removed debug logging


### Blockers Hit
- Repeated STT misfires on non-English audio fragments (Hindi, Japanese) interrupted one test attempt mid-confirmation — resolved by simply retrying the request cleanly; no code issue, environmental/mic noise
- Latency spiked severely (up to ~18s) during a run of consecutive failed searches — confirmed as a compounding effect of ngrok free tier + cross-region distance to AssemblyAI's servers, not a backend performance issue (backend itself responds instantly in every direct test)
- AssemblyAI's `/v1/token` endpoint requires `expires_in_seconds` as a query param — not obvious from the example I initially checked, only surfaced by reading the API's actual error response directly

### Next Session
- Decide: move off ngrok to real hosting (reduces latency, removes single point of failure ahead of demo) vs. begin the React dashboard (MASTER_SPEC required deliverable)
- If hosting: evaluate Render or Railway free tier for FastAPI + PostgreSQL
- If dashboard: scaffold React + Tailwind project, build transcript/KPI/activity-log views per ARCHITECTURE.md §8
- Begin evaluating real hosting (Render/Railway free tier) to replace ngrok and reduce latency for the final demo
- Scaffold a new Vite + React + Tailwind project (`frontend/`)
- Port `app.js`'s audio worklet + WebSocket logic into a React component, pointed at our own `/api/voice-token` instead of the starter's `/token`
- Hardcode/env the known `agent_id` directly (no need for the starter's publish/resolve logic — our agent already exists)
- Build KPI cards (business_snapshot), best-sellers panel, and activity-log panel around the voice component


























## Session 2026-09-13 — Hosting Migration to Render (Backend + Database)

### Goal
- Replace local Docker Postgres + ngrok/local uvicorn with permanent, real hosting
- Eliminate the latency bottleneck identified during React dashboard testing

### Decisions Made
- Chose Render over Railway: genuinely free tier, no credit card required, matches budget constraint
- Free-tier tradeoffs accepted knowingly: web service spins down after 15 min idle (~30-50s cold start), Postgres free tier expires ~30 days (2026-10-13) — acceptable for hackathon timeline
- Used PUT (not POST) to update the existing AssemblyAI agent in place, avoiding further duplicate agents
- Standardized on `agent_0b8e9da298d542c6989819231c753a01` as the single source of truth going forward; older agent left dormant, not deleted yet
- Local `.env` temporarily repointed at the Render database to run one-off schema/seed scripts, then switched back to local Docker for continued local development — production and local dev environments now cleanly separated

### What Got Built
- `requirements.txt` (repo root)
- Render Postgres instance (`voiceops-db`)
- Render Web Service (`voiceops-api`), auto-deploying from GitHub on push
- Updated `backend/register_agent.py` — PUT-based agent update, Render URLs, no ngrok header
- Updated `frontend/.env` — correct agent_id and live backend URL

### What Was Verified
- `GET /health` on live Render URL → `{"status":"ok","database":"connected"}`
- `GET /tools/business_snapshot` on live Render URL → real seeded data (10 customers, 30 orders, $502.50, 6 overdue)
- Full voice call tested through the React dashboard against the fully-hosted stack: `best_sellers` called correctly with a `limit` parameter, then a compound question triggered two tool calls and the agent correctly summed the results (35 + 10 = 45)
- No local services (uvicorn, Docker, ngrok) were running during this test — confirms the hosted stack is genuinely self-sufficient

### Blockers Hit
- Agent duplication from parallel use of a different assistant during a rate-limit window — resolved by standardizing on one agent_id and rewriting the registration script to update rather than create

### Next Session
- Deploy the React frontend itself as a Render Static Site (currently only the backend + database are hosted; the dashboard still runs on local Vite dev server)
- Update backend CORS `allow_origins` to include the deployed frontend's real URL once known
- Once frontend is hosted too, VoiceOps has a genuine public demo URL — required for MASTER_SPEC's "Deployed demo" and for recording the final demo video