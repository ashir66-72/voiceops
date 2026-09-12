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

### Decisions Made
- Writes use POST, reads use GET — POST can't be triggered accidentally (browser prefetch, link bots), which matters for state-changing actions
- Request validation moved to Pydantic models (`backend/schemas.py`) rather than manual checks in route functions — invalid JSON shape is rejected before it reaches business logic
- `send_payment_reminder` only accepts payments with status `overdue` or `pending` — rejects `paid` payments with a 400, since reminding on a settled payment is a logic error, not a valid action
- Response for `send_payment_reminder` explicitly includes a "simulated" disclosure string per ADR-006 — prevents the AssemblyAI agent from ever being able to claim a real message was sent
- Confirmation-before-write (per MASTER_SPEC §10) is a conversation-level responsibility for the AssemblyAI agent, not something enforced in the backend — backend's job is strict validation + audit logging, not conversational flow control

### What Got Built
- `backend/schemas.py` — AddNoteRequest, SendPaymentReminderRequest
- `add_note()` and `send_payment_reminder()` in `backend/tools.py`, both writing to `activity_log` on success
- `POST /tools/add_note`, `POST /tools/send_payment_reminder` in `backend/main.py`

### What Was Verified
- `add_note` success: note created for Ahmed Khan (customer_id 1), returned note_id 2
- `add_note` failure: customer_id 9999 → 404 with clear error message
- `send_payment_reminder` success: payment_id 26 (Hina Riaz, overdue) → 200, reminder_sent_at set, "simulated" note present
- `send_payment_reminder` failure: payment_id 1 (already paid) → 400, correct rejection reason
- `send_payment_reminder` failure: payment_id 9999 (nonexistent) → 404

### Blockers Hit
- None

### Next Session
- Begin AssemblyAI HTTP tool integration — connect the stored voice agent to these six endpoints
- Expose local FastAPI server publicly (ngrok or equivalent) since AssemblyAI's cloud agent can't reach localhost directly
- Wire and test one tool end-to-end via voice before wiring all six