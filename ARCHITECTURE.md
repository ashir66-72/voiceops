# VoiceOps — Architecture

## 1. High-Level Architecture

                    ┌─────────────────────┐
                    │       USER          │
                    │   speaks naturally  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      BROWSER        │
                    │ React + microphone │
                    └──────────┬──────────┘
                               │
                     temporary token
                               │
                               ▼
                    ┌─────────────────────┐
                    │     ASSEMBLYAI      │
                    │    Voice Agent      │
                    │                     │
                    │ STT                 │
                    │ LLM reasoning      │
                    │ TTS                 │
                    │ turn handling      │
                    │ tool calling       │
                    └──────────┬──────────┘
                               │
                         HTTP tool call
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FASTAPI        │
                    │  Business boundary │
                    │                     │
                    │ validation          │
                    │ business logic      │
                    │ authorization rules │
                    └──────────┬──────────┘
                               │
                         SQLAlchemy
                               │
                               ▼
                    ┌─────────────────────┐
                    │     POSTGRESQL      │
                    │                     │
                    │ customers           │
                    │ products            │
                    │ orders              │
                    │ order_items         │
                    │ payments            │
                    │ notes               │
                    │ activity_log        │
                    └─────────────────────┘

---

## 2. Voice Request Flow

Example:

"Who owes us money?"

1. User speaks.
2. Browser captures microphone audio.
3. Audio is sent to AssemblyAI Voice Agent.
4. AssemblyAI determines that overdue payment information is required.
5. Agent selects overdue_payments.
6. AssemblyAI sends an HTTP request to FastAPI.
7. FastAPI validates the request.
8. FastAPI queries PostgreSQL.
9. PostgreSQL returns the authoritative data.
10. FastAPI returns structured JSON.
11. AssemblyAI uses the result.
12. AssemblyAI speaks the answer.
13. Browser displays conversation/activity state.

---

## 3. Write Request Flow

Example:

"Remind Ahmed about his payment."

1. User requests action.
2. Agent identifies Ahmed.
3. Agent retrieves Ahmed's current payment state.
4. Agent states the intended action and amount.
5. Agent asks for confirmation.
6. User says yes.
7. Agent invokes send_payment_reminder.
8. FastAPI validates the target.
9. Backend records the reminder.
10. Backend creates an activity_log entry.
11. Backend returns success.
12. Agent speaks the result.
13. Dashboard shows the new activity.

---

## 4. Browser Security

Permanent secrets remain server-side.

The browser must never receive:

ASSEMBLYAI_API_KEY

The intended browser architecture is:

Browser
→ GET /api/voice-token
→ FastAPI
→ AssemblyAI token endpoint
→ short-lived token
→ browser
→ Voice Agent WebSocket

---

## 5. Backend Responsibility

FastAPI is the trusted business boundary.

The backend owns:

- validation
- database queries
- business rules
- allowed actions
- write operations
- audit logging
- error reporting

The LLM does not receive unrestricted SQL access.

---

## 6. Tool Categories

### Read Tools

business_snapshot
find_customer
overdue_payments
best_sellers

### Write Tools

add_note
send_payment_reminder

---

## 7. Database Authority

PostgreSQL is the source of truth for:

- customers
- products
- orders
- order items
- payments
- notes
- action history

The AI model's memory is never treated as authoritative business data.

---

## 8. Frontend Responsibility

The React dashboard exists primarily to make the voice interaction visible.

It should show:

- connection status
- voice control
- transcript
- business KPIs
- current orders/best sellers
- activity log
- action result

The UI should not become a giant admin panel.

---

## 9. Architecture Constraints

Do not introduce:

Redis
Kafka
Kubernetes
microservices
vector database
event buses

unless a real requirement appears.

VoiceOps v1 is intentionally small.