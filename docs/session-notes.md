# VoiceOps — Session Notes

Notes from each AI-assisted working session.
Purpose: recover context quickly if a session is cut short.

---

## Session 2026-09-09 — Foundation + Environment

### Goal
- Establish project foundation
- Resolve Python version
- Prepare for PostgreSQL

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
- Docker is installed and working

### Blockers Hit
- PostgreSQL not yet running
- User will research PostgreSQL setup method before proceeding

### Next Session
- Set up PostgreSQL (Docker or local)
- Verify database connection
- Create FastAPI skeleton with /health endpoint

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

### Decisions Made
- Used Docker (per ADR-002 / ADR-007) instead of the pre-installed local Postgres 18
- Remapped Docker container to host port 5433 instead of 5432 — local Postgres 18 service was already bound to 5432 and caused a silent password-auth conflict, not an actual credential error
- `voiceops` database created via `POSTGRES_DB` env var at container start, no manual DB creation step needed

### What Got Built
- Docker container `voiceops-pg` (postgres:18), port 5433 → 5432
- `.env` file with `DATABASE_URL`
- `test_db_connection.py` — minimal SQLAlchemy connection proof
backend/` package: `__init__.py`, `database.py`, `main.py`
- `/health` GET endpoint returning API + DB status in one response

### What Was Verified
- `docker ps` shows `voiceops-pg` Up
- `netstat -ano | findstr :5432` confirmed a competing local listener, explaining the first connection failure
- `python test_db_connection.py` returned `Connection successful. Result: (1,)` after pointing `.env` at port 5433

- `uvicorn backend.main:app --reload` starts clean, no errors
- `GET /health` returns `200 OK` with `{"status":"ok","database":"connected"}`

### Blockers Hit
- Local Postgres 18 Windows service occupying port 5432, intercepting connections meant for the Docker container — surfaced as a misleading `password authentication failed` error rather than a port/connection error
- Resolved by moving the Docker container to port 5433 and updating `DATABASE_URL` to match

### Next Session
- Build backend structure (FastAPI skeleton)
- Add SQLAlchemy models for customers, products, orders, order_items, payments, notes, activity_log
- Add `/health` endpoint