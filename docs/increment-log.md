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

## Pending


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