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