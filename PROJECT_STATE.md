# VoiceOps — Current Project State

Last Updated:
2026-09-09



---

## CURRENT PHASE

Phase 2 — Environment + Database Foundation

---

## PROJECT STATUS

VoiceOps is actively being built.

The AssemblyAI voice loop has already been successfully demonstrated.

Python 3.13.2 environment is ready.

PostgreSQL is running in Docker and a database connection has been
verified from Python. Backend build (FastAPI) starts next.

---

## COMPLETED

### Planning

- [x] Product idea selected
- [x] MVP defined
- [x] Architecture defined
- [x] Six-tool scope frozen
- [x] Urban Bites demo business selected
- [x] Development methodology selected

### AssemblyAI

- [x] AssemblyAI account
- [x] API key
- [x] Official AssemblyAI starter
- [x] Agent published
- [x] Browser app running
- [x] Microphone works
- [x] Agent responds with voice

### Documentation

- [x] MASTER_SPEC.md
- [x] ARCHITECTURE.md
- [x] DECISIONS.md
- [x] PROJECT_STATE.md
- [x] docs/increment-log.md
- [x] docs/session-notes.md

### Environment

- [x] Python 3.13.2 virtual environment created
- [x] Old Python 3.10 venv replaced
- [x] Docker verified available (version 29.7.2)
- [x] PostgreSQL 18 detected on system (not in PATH)
- [x] Git repository initialized
- [x] First commit made
- [x] PostgreSQL running (Docker, container `voiceops-pg`, port 5433)
- [x] `voiceops` database created
- [x] Database connection verified from Python (SQLAlchemy + psycopg2)


### backend 
- [x] backend structure
- [x] database connection (wired into FastAPI via `backend/database.py`)
- [x] FastAPI
- [x] /health endpoint


### Database Schema
- [x] SQLAlchemy models for all 7 tables (customers, products, orders, order_items, payments, notes, activity_log)
- [x] Foreign key relationships defined
- [x] Tables created in `voiceops` database and verified


### data 
- [x] Urban Bites seed data (`seed_data.py`) — deterministic, rerunnable
- [x] Database verification (row counts, payment status split, best-seller check)



### Tools
- [x] business_snapshot
- [x] find_customer
- [x] overdue_payments
- [x] best_sellers





---

## NOT COMPLETED

### Environment


### Backend





### Tools


- [ ] add_note
- [ ] send_payment_reminder

### AssemblyAI integration

- [ ] Stored VoiceOps agent configuration
- [ ] HTTP tool definitions
- [ ] First HTTP tool
- [ ] All six tools
- [ ] End-to-end tool loop

### Frontend

- [ ] React project
- [ ] dashboard
- [ ] transcript UI
- [ ] KPI cards
- [ ] tool activity
- [ ] activity log

### Deployment

- [ ] managed PostgreSQL
- [ ] hosted FastAPI
- [ ] hosted frontend
- [ ] temporary voice token endpoint
- [ ] production agent configuration
- [ ] clean-room test

### Submission

- [ ] README
- [ ] architecture diagram
- [ ] screenshots
- [ ] cover image
- [ ] demo video
- [ ] slides
- [ ] public GitHub
- [ ] demo URL
- [ ] Lablab submission

---

## CURRENT BLOCKER

None. PostgreSQL environment blocker resolved 2026-09-11.

---

## CURRENT IMMEDIATE OBJECTIVE

## CURRENT IMMEDIATE OBJECTIVE

Build the two write tools per MASTER_SPEC §6 and §10: add_note and
send_payment_reminder. Both must follow the write-action rule —
identify target, read current state, confirm intent, execute, log.

Order:

1. Implement add_note (simple write: customer_id + content → notes table).
2. Implement send_payment_reminder (validate target payment exists and is overdue/pending, record simulated reminder, update reminder_sent_at).
3. Both write tools create an activity_log entry on success.
4. Test each with curl — including failure cases (invalid customer_id, invalid payment_id).

## DO NOT DO YET

Do not:

- build React
- build six tools
- configure production deployment
- add new features
- change database architecture
- add external messaging
- add Redis/Kafka/Kubernetes
- rewrite the AssemblyAI starter
- expose the AssemblyAI API key
- commit .env

---

## DEVELOPMENT RULE

Never continue to the next major phase until the current phase is tested.

For every increment:

BUILD
→ RUN
→ VERIFY
→ DOCUMENT
→ COMMIT

---



## CURRENT NEXT ACTION

Build add_note and send_payment_reminder write tools with activity_log entries.
---

## LAST KNOWN WORKING STATE

AssemblyAI browser starter:
WORKING

Local application directory:
WORKING

Python 3.13.2 venv:
WORKING

AssemblyAI API credentials:
CONFIGURED LOCALLY

Voice interaction:
WORKING

PostgreSQL:
RUNNING (Docker, port 5433) — connection verified

dataase schema created 7 tables .
 Schema |     Name     | Type  |  Owner   
--------+--------------+-------+----------
 public | activity_log | table | postgres
 public | customers    | table | postgres
 public | notes        | table | postgres
 public | order_items  | table | postgres
 public | orders       | table | postgres
 public | payments     | table | postgres
 public | products     | table | postgres
---

## IMPORTANT PROJECT RULE

VoiceOps must not inherit architecture, database assumptions, code,
debugging patterns, or implementation from other unrelated projects.

This project has its own architecture and source of truth.