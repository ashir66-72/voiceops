# VoiceOps — Increment Log

One line per increment. Dated. Scannable.
This is the project timeline.

---

## 2026-09-09

- Project foundation established (MASTER_SPEC, ARCHITECTURE, DECISIONS, PROJECT_STATE)
- Local Git repository initialized
- First commit: "chore: establish VoiceOps project foundation"
- AssemblyAI starter voice loop verified working (from earlier setup)
- Python 3.13.2 virtual environment created (replaced 3.10)

---

## 2026-09-11

- PostgreSQL 18 running via Docker (container `voiceops-pg`, remapped to port 5433 after conflict with local Postgres 18 service on port 5432)
- `voiceops` database created inside the container
- SQLAlchemy, psycopg2-binary, python-dotenv installed in the 3.13.2 venv
- `.env` created with `DATABASE_URL`, confirmed excluded via existing `.gitignore`
- Database connection verified from Python (`test_db_connection.py`, `SELECT 1` succeeded)
- FastAPI backend skeleton created (`backend/main.py`, `backend/database.py`)
- `/health` endpoint implemented and verified — confirms API up and DB reachable in one call
- SQLAlchemy models created for all 7 tables (`backend/models.py`): customers, products, orders, order_items, payments, notes, activity_log
- Foreign key relationships wired between customers↔orders, orders↔order_items, orders↔payments, products↔order_items, customers↔notes
- `create_tables.py` script run — all 7 tables created in `voiceops` database
- Verified via `docker exec ... psql -c "\dt"` — all 7 tables present
- `seed_data.py` created — deterministic Urban Bites dataset (truncate-and-reseed pattern, fixed anchor date)
- Seeded: 10 customers, 6 products, 30 orders, 55 order_items, 30 payments
- Payment split: 20 paid / 6 overdue / 4 pending — verified via SQL query
- Best-seller verified: Chicken Biryani (35 units) clearly ahead of next product (10 units)
- `backend/tools.py` created — business logic for the four read tools (business_snapshot, find_customer, overdue_payments, best_sellers)
- `get_db` dependency added to `backend/database.py` for per-request session handling
- Four routes wired into `backend/main.py`: `/tools/business_snapshot`, `/tools/find_customer`, `/tools/overdue_payments`, `/tools/best_sellers`
- All four endpoints tested manually via curl — verified against known seed data values




## 2026-09-12

- `backend/schemas.py` created — Pydantic request models for write tools (AddNoteRequest, SendPaymentReminderRequest)
- `add_note` and `send_payment_reminder` implemented in `backend/tools.py`, each creates an `activity_log` entry on success
- Two POST routes wired into `backend/main.py`: `/tools/add_note`, `/tools/send_payment_reminder`
- Both write tools tested for success and failure cases (invalid customer_id, invalid payment_id, wrong payment status) — all returned correct status codes and error messages
- All six tools from ADR-005 now implemented and verified — backend business layer complete
- AssemblyAI stored agent "VoiceOps — Urban Bites" created via `backend/register_agent.py`, agent_id saved to `.env`
- All six tools registered as HTTP tools on the stored agent, each pointed at the local FastAPI backend through the ngrok tunnel
- Agent imported into `assemblyai-starter` for live browser testing (`agents/voiceops-urban-bites.jsonc`)
- End-to-end voice test successful: real voice request → AssemblyAI tool call → FastAPI → PostgreSQL → spoken response, verified for `business_snapshot` and `best_sellers` — all figures matched seed data exactly
- Noted latency source: ngrok free tier + cross-region distance to AssemblyAI's servers — expected to improve after moving off ngrok to real hosting
- All six MASTER_SPEC tools now verified working end-to-end by real voice interaction: business_snapshot, best_sellers, find_customer, overdue_payments, send_payment_reminder, add_note
- Confirmed find_customer correctly rejects near-miss spellings ("Ahmad" vs "Ahmed") rather than guessing — matches Quality Rule "admit missing data"
- Confirmed both write tools (add_note, send_payment_reminder) pause for explicit user confirmation before executing, per MASTER_SPEC §10
- Verified add_note writes via direct SQL check on notes and activity_log tables (two real entries, ids 7 and 8, correct customer_id and content)
- Observed severe latency spikes (up to ~18s) during multi-turn retries, isolated to ngrok free tier + cross-region network distance, not application logic
- `GET /api/voice-token` added to FastAPI backend — mints short-lived AssemblyAI tokens server-side, per ARCHITECTURE.md §4 (browser never touches the permanent API key)
- `GET /tools/activity_log` added — dashboard-only read endpoint (not exposed to the voice agent, does not count against ADR-005's six-tool freeze), returns recent audit-log entries
- Fixed: AssemblyAI's token endpoint requires `expires_in_seconds` as a query parameter — omitting it caused a 422, surfaced via temporary debug logging
- Backend now has everything the React dashboard needs: token minting, activity log, plus the existing six tools


## Pending



---




## 2026-9-13

- Ported `app.js`'s audio worklet + WebSocket voice engine into a React hook (`useVoiceAgent.js`)
- Built full dashboard UI in React + Tailwind: call control, live transcript, KPI strip, best-sellers, overdue payments, activity log
- Added CORS middleware to FastAPI backend so the React dev server (port 5173) can call the API (port 8000)
- Fixed missing `/tools/activity_log` route that was causing a full dashboard crash on load
- Verified live voice call works end-to-end from the new React dashboard: real question, real tool call, correct spoken answer, live KPI panel
- Noted latency (~few seconds to connect, few seconds to first spoken word) — confirmed as the same root cause already logged (ngrok + cross-region distance to AssemblyAI), not a regression from the React port











##  2026-9-14

- Created Render Postgres (`voiceops-db`, free tier, expires 2026-10-13) and Render Web Service (`voiceops-api`), connected to GitHub repo for auto-deploy on push
- `requirements.txt` added to repo root, confirmed working via successful Render build
- Database schema and Urban Bites seed data migrated to Render Postgres (create_tables.py + seed_data.py run against the remote DB via temporary local .env repoint)
- Verified live: `/health` and `/tools/business_snapshot` both confirmed working directly against the deployed Render URL
- Discovered and resolved an agent duplication: a second AssemblyAI agent had been created via a parallel session with another assistant while rate-limited; adopted `agent_0b8e9da298d542c6989819231c753a01` as the single canonical agent going forward
- `register_agent.py` rewritten from POST (create) to PUT (update-in-place) targeting the correct agent_id; tool URLs repointed from ngrok to the live Render backend; ngrok-only header removed
- `frontend/.env` updated: correct agent_id, `VITE_BACKEND_URL` switched from localhost to the live Render URL
- Verified full end-to-end voice call through the React dashboard talking entirely to Render — zero local dependencies (no uvicorn, no Docker, no ngrok) — including a multi-tool question requiring the agent to combine two `best_sellers`/lookup results and compute a correct sum
- Latency improved substantially versus the ngrok-based setup, confirming the migration's purpose
- Deployed React dashboard as Render Static Site `voiceops-ffl0` (root directory `frontend`, build `npm run build`, publish `dist`)
- Added live frontend origin `https://voiceops-ffl0.onrender.com` to FastAPI CORS `allow_origins`
- First public dashboard load failed: Vite baked `VITE_BACKEND_URL` as the static-site URL instead of `https://voiceops-api-ml1i.onrender.com`, so KPI fetches and `/api/voice-token` 404'd on the static host (CORS was already correct)
- Fixed by setting Render static-site env `VITE_BACKEND_URL` + `VITE_ASSEMBLYAI_AGENT_ID` and rebuilding (Vite env is build-time, not runtime)
- Verified public dashboard KPIs populate from production Postgres and Start call works on https://voiceops-ffl0.onrender.com
- MASTER_SPEC required feature "Deployed demo" is now satisfied



## Rules

- One line per completed increment.
- Date every entry (YYYY-MM-DD).
- Never edit old entries. Add new ones.
- If an increment is reverted, note it.
