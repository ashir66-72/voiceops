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

PostgreSQL setup is in progress.

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

---

## NOT COMPLETED

### Environment

- [ ] PostgreSQL running (Docker or local)
- [ ] `voiceops` database created
- [ ] Database connection verified from Python

### Backend

- [ ] backend structure
- [ ] SQLAlchemy
- [ ] database connection
- [ ] models
- [ ] FastAPI
- [ ] /health endpoint

### Data

- [ ] Urban Bites seed data
- [ ] database verification
- [ ] tests

### Tools

- [ ] business_snapshot
- [ ] find_customer
- [ ] overdue_payments
- [ ] best_sellers
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

PostgreSQL is not yet running.

Decision pending: use Docker or local PostgreSQL 18 install.

---

## CURRENT IMMEDIATE OBJECTIVE

Get PostgreSQL running and verify a database connection.

Order:

1. Decide PostgreSQL method (Docker recommended).
2. Run PostgreSQL.
3. Create `voiceops` database.
4. Verify connection.
5. Then create SQLAlchemy models.

---

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

Set up PostgreSQL.

After that:
database connection proof.

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
NOT RUNNING

---

## IMPORTANT PROJECT RULE

VoiceOps must not inherit architecture, database assumptions, code,
debugging patterns, or implementation from other unrelated projects.

This project has its own architecture and source of truth.