# VoiceOps — Current Project State

Last Updated:
2026-09-14

---

## CURRENT PHASE

Phase 4 — Deployed demo complete; submission packaging next

---

## PROJECT STATUS

VoiceOps is live end-to-end with no local services required.

Backend, Postgres, AssemblyAI agent, and React dashboard are all hosted.
All six MVP tools remain the voice-agent tool set. The public demo URL
works: KPIs load from production data and Start call connects through
server-minted tokens.

Remaining work is submission packaging (README, screenshots, demo video,
slides, Lablab form) plus a clean-room/mobile check. New product features
are not started until ADR-005 is reviewed on purpose.

---

## LIVE URLS

- Dashboard: https://voiceops-ffl0.onrender.com
- API: https://voiceops-api-ml1i.onrender.com
- Canonical agent: `agent_0b8e9da298d542c6989819231c753a01`
- GitHub: https://github.com/ashir66-72/voiceops

---

## COMPLETED

### Planning

- [x] Product idea selected
- [x] MVP defined
- [x] Architecture defined
- [x] Six-tool scope frozen (ADR-005)
- [x] Urban Bites demo business selected
- [x] Development methodology selected

### AssemblyAI

- [x] AssemblyAI account
- [x] API key (server-side only)
- [x] Official AssemblyAI starter (local proof)
- [x] Stored agent published
- [x] Canonical production agent adopted (`agent_0b8e9da298d542c6989819231c753a01`)
- [x] Browser microphone + spoken response
- [x] All six tools verified by real voice
- [x] Confirmation-before-write verified for add_note and send_payment_reminder
- [x] Write-tool database effects verified via SQL
- [x] Production agent tool URLs pointed at live Render API

### Documentation

- [x] MASTER_SPEC.md
- [x] ARCHITECTURE.md
- [x] DECISIONS.md
- [x] PROJECT_STATE.md
- [x] docs/increment-log.md
- [x] docs/session-notes.md

### Environment (local)

- [x] Python 3.13.2 virtual environment
- [x] Git repository + GitHub remote
- [x] Local Docker Postgres (`voiceops-pg`, port 5433) for local work
- [x] Database connection verified from Python

### Backend

- [x] FastAPI app
- [x] `/health`
- [x] `/api/voice-token` (short-lived token minting; browser never gets ASSEMBLYAI_API_KEY)
- [x] `/tools/activity_log` (dashboard-only, not a voice tool)
- [x] All six MVP tool routes
- [x] CORS allow-list includes localhost and the live dashboard origin

### Database Schema

- [x] SQLAlchemy models for all 7 tables
- [x] Foreign keys defined
- [x] Tables created and seeded (local + Render)

### Data

- [x] Urban Bites seed data (`seed_data.py`) — deterministic, rerunnable
- [x] Verified: 10 customers, 6 products, 30 orders, 55 order_items, 30 payments
- [x] Payment split: 20 paid / 6 overdue / 4 pending
- [x] Best-seller: Chicken Biryani (35 units)

### Tools

- [x] business_snapshot
- [x] find_customer
- [x] overdue_payments
- [x] best_sellers
- [x] add_note
- [x] send_payment_reminder

### Frontend

- [x] Vite + React + Tailwind project in `frontend/`
- [x] `useVoiceAgent.js` audio worklet + WebSocket voice engine
- [x] dashboard
- [x] transcript UI
- [x] KPI cards
- [x] best sellers + overdue panels
- [x] activity log panel

### Deployment

- [x] Managed PostgreSQL (Render, `voiceops-db`, free tier expires 2026-10-13)
- [x] Hosted FastAPI (`voiceops-api`, auto-deploy from GitHub)
- [x] Hosted React static site (`voiceops-ffl0`, root `frontend`, publish `dist`)
- [x] Vite production env set on the static site and rebuilt:
      `VITE_BACKEND_URL=https://voiceops-api-ml1i.onrender.com`
      `VITE_ASSEMBLYAI_AGENT_ID=agent_0b8e9da298d542c6989819231c753a01`
- [x] Backend CORS allows `https://voiceops-ffl0.onrender.com`
- [x] Live dashboard KPIs populate from production data
- [x] Start call works on the public URL

---

## NOT COMPLETED

### Verification still in progress

- [ ] Clean-room / mobile test of the public URL (in progress 2026-09-14)

### Submission

- [ ] Public GitHub README (repo currently has no root README)
- [ ] Architecture diagram for judges
- [ ] Screenshots
- [ ] Cover image
- [ ] Demo video
- [ ] Slides
- [ ] Demo URL listed on GitHub About + Lablab
- [ ] Lablab submission

---

## CURRENT BLOCKER

None for the hosted stack. First static-site load failed because
`VITE_BACKEND_URL` was baked as the frontend origin instead of the API.
Fixed by correcting Render static-site env vars and rebuilding.

Render free web service still cold-starts after ~15 minutes idle
(~30–50s). Expected. Not a product bug.

---

## CURRENT IMMEDIATE OBJECTIVE

Finish a clean-room test of https://voiceops-ffl0.onrender.com
(including mobile). Then write a public README so judges can understand
the project from GitHub.

Do not add a seventh voice tool until ADR-005 is explicitly amended.

---

## DO NOT DO YET

Do not:

- add a 7th voice tool without replacing one (ADR-005)
- add real WhatsApp / SMS / payments
- add Redis / Kafka / Kubernetes / microservices
- commit `.env` or API keys
- record the demo video before the public URL is verified on a second device
- start Lablab submission packaging before README exists

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

1. Clean-room / mobile test of the live dashboard.
2. Add a root README (problem, demo URL, architecture, how to run).

---

## LAST KNOWN WORKING STATE

Public dashboard:
WORKING — https://voiceops-ffl0.onrender.com

Public API:
WORKING — https://voiceops-api-ml1i.onrender.com
`/health` → `{"status":"ok","database":"connected"}`
`/tools/business_snapshot` → 10 customers, 30 orders, $502.50, 6 overdue

Voice call on hosted dashboard:
WORKING (desktop). Mobile clean-room test pending.

Canonical agent:
`agent_0b8e9da298d542c6989819231c753a01`

Local Python 3.13.2 venv:
WORKING (optional; production no longer depends on it)

Local Docker Postgres:
AVAILABLE for local work; production uses Render Postgres

Vite note:
`VITE_*` values are baked at static-site build time. Changing them on
Render requires a rebuild, not just a runtime env save.

---

## IMPORTANT PROJECT RULE

VoiceOps must not inherit architecture, database assumptions, code,
debugging patterns, or implementation from other unrelated projects.

This project has its own architecture and source of truth.
