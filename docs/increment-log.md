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

## Pending

- PostgreSQL setup (method TBD — Docker or local install)
- FastAPI backend skeleton
- SQLAlchemy models
- Seed data
- Business tools
- AssemblyAI HTTP tool integration
- React dashboard
- Deployment
- Submission package

---

## Rules

- One line per completed increment.
- Date every entry (YYYY-MM-DD).
- Never edit old entries. Add new ones.
- If an increment is reverted, note it.