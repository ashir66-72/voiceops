# VoiceOps — Architecture Decision Record

Every important technical/product decision goes here.

Format:

Decision
Date
Status
Reason
Alternatives considered
Consequence

---

## ADR-001 — Use AssemblyAI Voice Agent API

Date:
2026-09-09

Status:
Accepted

Decision:
Use AssemblyAI Voice Agent API as the core voice layer.

Reason:
The hackathon requires meaningful AssemblyAI usage and the Voice Agent API
provides the managed real-time voice experience we need.

Alternatives:
Build custom STT + LLM + TTS pipeline.

Why rejected:
Unnecessary complexity and development time.

Consequence:
AssemblyAI owns the real-time voice loop while VoiceOps owns business
logic and tools.

---

## ADR-002 — Use PostgreSQL

Date:
2026-09-09

Status:
Accepted

Decision:
Use PostgreSQL as the authoritative application database.

Reason:
VoiceOps uses structured relational business data involving customers,
orders, order items, products, payments, notes and activity history.

Alternatives:
MongoDB
SQLite

Why not MongoDB:
The MVP relies heavily on relationships, joins and aggregation.

Why not SQLite:
SQLite remains an acceptable local fallback if PostgreSQL installation
becomes a serious blocker, but PostgreSQL remains the target database.

Consequence:
The project gets a relational source of truth and practical SQL experience.

---

## ADR-003 — Use FastAPI

Date:
2026-09-09

Status:
Accepted

Decision:
Use Python + FastAPI as the business backend.

Reason:
FastAPI is lightweight, typed-friendly and suitable for HTTP tool endpoints
and PostgreSQL access.

Alternatives:
Node.js/Express
Django

Why rejected:
FastAPI gives us a smaller backend for this MVP and fits the existing Python
direction.

---

## ADR-004 — Use HTTP Tools

Date:
2026-09-09

Status:
Accepted

Decision:
VoiceOps v1 will use AssemblyAI HTTP tools connected to FastAPI.

Reason:
Business logic should remain inside our backend while AssemblyAI handles
the tool round trip.

Alternatives:
Client-side function tools.

Why rejected:
The HTTP-tool architecture gives us a cleaner trusted backend boundary
for this application.

---

## ADR-005 — Six-Tool Scope Freeze

Date:
2026-09-09

Status:
Accepted

Decision:
The MVP contains exactly six tools.

Tools:

1. business_snapshot
2. find_customer
3. overdue_payments
4. best_sellers
5. add_note
6. send_payment_reminder

Reason:
Feature creep is a larger risk than missing optional functionality.

Consequence:
Any new feature must replace an existing feature rather than expanding
the scope.

---

## ADR-006 — Simulated Payment Reminder

Date:
2026-09-09

Status:
Accepted

Decision:
send_payment_reminder will record a demo action rather than send a real
external message.

Reason:
The hackathon demo needs a visible write action without creating a false
claim that WhatsApp/SMS was actually delivered.

Consequence:
The database will record the reminder and activity_log entry.

---

## ADR-007 — Incremental + Risk-Driven Development

Date:
2026-09-09

Status:
Accepted

Decision:
Build VoiceOps incrementally and eliminate major technical risks with
small proofs before building dependent functionality.

Reason:
The project is long enough that uncontrolled AI/vibe coding could create
inconsistent architecture and difficult debugging.

Process:

Requirement
→ Design
→ Risk
→ Proof
→ Implement
→ Test
→ Verify
→ Document
→ Commit

---

## ADR-008 — Repository Is the Project Memory

Date:
2026-09-09

Status:
Accepted

Decision:
The repository documentation is the persistent project memory.

Reason:
Conversation history is not a reliable engineering source of truth.

Core memory files:

MASTER_SPEC.md
ARCHITECTURE.md
DECISIONS.md
PROJECT_STATE.md

Consequence:
Every session can recover the project's current state from Git.

---

## ADR-009 — Urban Bites Synthetic Dataset

Date:
2026-09-09

Status:
Accepted

Decision:
Use a fictional business called Urban Bites with deterministic synthetic
data.

Reason:
A voice business operator needs realistic data to demonstrate retrieval,
aggregation and actions.

No real customer data will be required for the MVP.

---

## ADR-010 — Host Production on Render

Date:
2026-09-14

Status:
Accepted

Decision:
Production hosting is Render:

- PostgreSQL: `voiceops-db`
- FastAPI web service: `voiceops-api` at https://voiceops-api-ml1i.onrender.com
- React static site: `voiceops-ffl0` at https://voiceops-ffl0.onrender.com
- Canonical agent: `agent_0b8e9da298d542c6989819231c753a01`

Reason:
Need a public demo URL for the hackathon. Render free tier needs no credit
card. Static site for the Vite dashboard; web service for FastAPI; managed
Postgres as the source of truth.

Alternatives:
Railway, Vercel (frontend only), keep ngrok.

Why rejected:
ngrok latency was already measured as the main demo risk. Vercel would
split hosting. Railway required a card at decision time.

Consequence:

- Backend CORS must include the static-site origin.
- `VITE_BACKEND_URL` and `VITE_ASSEMBLYAI_AGENT_ID` must be set on the
  static-site service and the site must be rebuilt after any change.
- Free web service cold-starts after ~15 minutes idle.
- Free Postgres expires 2026-10-13; re-seed or upgrade before then.
- Git push auto-deploys backend; static site rebuilds on push and on env change.
