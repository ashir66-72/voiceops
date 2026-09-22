# VoiceOps — AI Voice Business Operator

> Ask your business a question. Get a real answer. By voice.

**Live Demo:** https://voiceops-ffl0.onrender.com  
**Hackathon:** AssemblyAI Voice Agent Hackathon

---

## What It Does

VoiceOps is a voice-first business operator for Chicago Ramen, a restaurant 
in Mundelein, Illinois. The owner speaks naturally and gets real answers 
backed by live business data — no screens, no dashboards, no manual lookup.

**Example conversations:**
- *"How are we doing this week?"* → order trends, revenue, top product, ratings
- *"Tell me about our competitors"* → 11 real nearby businesses from live market data  
- *"Who owes us money?"* → named customers with exact overdue amounts
- *"Remind Anthony about his payment"* → confirmation flow, then logged to audit trail
- *"What are our best sellers?"* → ranked by actual order history

---

## What Makes It Different

Most voice agents are a voice layer over a static database. VoiceOps combines:

- **Internal business truth** — PostgreSQL with real order history, payments, reviews
- **Live external intelligence** — real-time weather (Open-Meteo) and nearby 
  competitor data (Geoapify) combined with internal metrics
- **Confirmation before action** — write operations require explicit voice confirmation
- **Full audit trail** — every action logged to activity_log
- **Live dashboard** — React frontend updates in real time after every tool call

---

## Architecture

Browser (React dashboard + microphone)
↓
AssemblyAI Voice Agent (STT + LLM reasoning + TTS + tool selection)
↓ HTTP tool call
FastAPI (business boundary — validation, logic, auth rules)
↓
PostgreSQL (internal business truth)
+ Open-Meteo API (live weather — free, no key)
+ Geoapify Places API (nearby competitors — free tier)


The browser never touches the AssemblyAI API key.  
A short-lived token is minted server-side and passed to the browser.

---

## Six Voice Tools

| Tool | Type | What it does |
|---|---|---|
| `business_intelligence` | Read | Internal trends + live weather + competitor data |
| `business_snapshot` | Read | Total orders, revenue, overdue payment summary |
| `overdue_payments` | Read | Customers with late payments |
| `best_sellers` | Read | Top products by quantity sold |
| `add_note` | Write | Add a note to a customer record |
| `send_payment_reminder` | Write | Record a simulated payment reminder |

---

## Tech Stack

- **Voice:** AssemblyAI Voice Agent API
- **Backend:** Python 3.13 + FastAPI + SQLAlchemy
- **Database:** PostgreSQL (Render managed)
- **External APIs:** Open-Meteo (weather), Geoapify (places)
- **Frontend:** React + Tailwind CSS + Vite
- **Hosting:** Render (API + DB + static site)

---

## Local Setup

```bash
# Clone
git clone https://github.com/ashir66-72/voiceops
cd voiceops

# Python env
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Environment variables
cp .env.example .env
# Fill in: DATABASE_URL, ASSEMBLYAI_API_KEY, GEOAPIFY_API_KEY,
#          ASSEMBLYAI_AGENT_ID, PUBLIC_BASE_URL

# Database
python create_tables.py
python seed_data.py

# Run backend
uvicorn backend.main:app --reload

# Run frontend
cd frontend
npm install
npm run dev
```

---

## Demo Business

Chicago Ramen Mundelein — 404 N Lake St, Mundelein, IL 60060  
Real menu items and prices. Synthetic but realistic order history,  
customers, payments, and reviews for September 2026.

---

## Key Design Decisions

- **Backend is the trust boundary** — the LLM never gets direct DB access
- **Write actions require confirmation** — enforced via system prompt, not code
- **External data is evidence, not conclusion** — agent says "may be relevant", never invents causality
- **Simulated reminders** — send_payment_reminder logs the action but sends no real message
- **Deterministic seed data** — demo always produces predictable, realistic results