# VoiceOps — Master Specification

## 1. Project Identity

Project Name:
VoiceOps — Your AI Business Operator

Hackathon:
AssemblyAI Voice Agent Hackathon

Target:
A working, demo-ready voice business operator.

Status:
Development — deployed demo live; submission packaging remaining

Current Date:
2026-09-14

---

## 2. Problem

Small-business owners often have useful business information stored in
databases, dashboards, spreadsheets, or business software.

The information exists, but accessing it can require manually navigating
multiple screens.

VoiceOps aims to reduce that friction by allowing the owner to ask for
business information and perform selected routine actions through natural
voice conversation.

---

## 3. Product

VoiceOps is a voice-first business operator for a fictional small business
called Urban Bites.

The owner can:

1. Ask for current business information.
2. Find customers.
3. Check pending payments.
4. Ask about best-selling products.
5. Add customer notes.
6. Record a payment reminder after confirmation.

VoiceOps is NOT a generic voice chatbot.

Its value comes from connecting the voice conversation to real application
state.

---

## 4. Core Principle

The model decides what the user wants.

The backend decides:

- what is allowed
- what data is true
- what action actually happens

The model must never invent live business numbers.

---

## 5. Target User

Primary:

- Small-business owners
- Shop owners
- Restaurant owners
- Service-business owners
- Small delivery/business teams
- Staff who need quick business information while away from a desk

---

## 6. MVP Scope

### Read Tools

1. business_snapshot
2. find_customer
3. overdue_payments
4. best_sellers

### Write Tools

5. add_note
6. send_payment_reminder

### Required Product Features

- AssemblyAI Voice Agent in browser
- PostgreSQL business data
- FastAPI tool endpoints
- Six tools
- Confirmation before write actions
- Dashboard
- Activity log
- Public GitHub repository
- Deployed demo
- Demo video
- Presentation slides

---

## 7. What Is NOT in MVP

Do not implement these before the must-ship system works:

- Real WhatsApp messaging
- Real SMS
- Real payment processing
- Real financial transfers
- Phone/SIP deployment
- Multiple business tenants
- Advanced authentication
- Advanced analytics
- Advanced charts
- Kubernetes
- Kafka
- Redis
- Microservices
- Vector database
- Unrestricted natural-language SQL

A seventh major feature must replace an existing feature rather than simply
being added.

---

## 8. Demo Business

Business:
Urban Bites

The business exists only as realistic synthetic demo data.

Target dataset:

- 10 customers
- 6 products
- 30 orders
- 30 payments
- Several pending payments
- Enough order_items for believable best-seller analytics

The dataset should be deterministic so the demo produces predictable
results.

---

## 9. Example User Requests

"Give me today's business summary."

"Who owes us money?"

"Find Ahmed Khan."

"Which product sells the most?"

"Add a note: he wants delivery tomorrow."

"Remind Ahmed about his payment."

---

## 10. Write-Action Rule

For state-changing actions:

User request
→ identify exact target
→ read current state
→ explain intended action
→ ask for confirmation
→ user confirms
→ execute write tool
→ write business state
→ write activity_log
→ speak result

No write operation may happen merely because the user mentioned an action.

---

## 11. Technology Stack

Voice:
AssemblyAI Voice Agent API

Backend:
Python 3.11+
FastAPI

Database:
PostgreSQL

ORM:
SQLAlchemy

Frontend:
React + Tailwind CSS

Version Control:
Git + GitHub

Hosting:
Render PostgreSQL
Render FastAPI web service
Render static site for the React dashboard

---

## 12. Architecture

Browser
↓
AssemblyAI Voice Agent
↓
HTTP Tool Call
↓
FastAPI
↓
PostgreSQL
↓
Tool Result
↓
AssemblyAI
↓
Spoken Response

The browser must never contain the permanent AssemblyAI API key.

The browser receives a short-lived authentication token from the backend.

---

## 13. Database Tables

customers

products

orders

order_items

payments

notes

activity_log

---

## 14. Quality Rules

Business facts must come from the database.

Tool input must be validated.

Tool results must be structured and concise.

Write operations must be auditable.

The agent must admit missing data.

The agent must admit tool failure.

The agent must never claim that a real external message was sent when the
MVP only records a simulated action.

---

## 15. Development Method

VoiceOps will be developed incrementally.

Every feature follows:

Requirement
→ Design
→ Risk identification
→ Small technical proof
→ Implementation
→ Test
→ Verification
→ Documentation
→ Git commit
→ Next increment

Do not build large portions of the system without verification.

---

## 16. Definition of Done

A feature is considered complete only when:

- implementation exists
- it runs
- expected behavior is verified
- failure cases are checked
- relevant tests pass
- documentation is updated
- changes are committed to Git

---

## 17. Current Project Phase

Phase:
Deployed demo live; submission packaging remaining

Completed:

- AssemblyAI account and stored agent
- Browser voice loop with microphone and spoken response
- PostgreSQL + SQLAlchemy models + Urban Bites seed data
- FastAPI backend and all six tools
- Confirmation-before-write on write tools
- React dashboard (KPIs, transcript, activity log)
- Hosted Postgres, API, and dashboard on Render
- Public demo URL

Not yet completed:

- Clean-room / mobile verification of the public URL
- Public GitHub README
- Architecture diagram for judges
- Screenshots and cover image
- Demo video
- Presentation slides
- Lablab submission

---

## 18. Current Immediate Goal

Verify the public dashboard on a second device, then write a public
README so judges can understand the project from GitHub.

Do not add a seventh voice tool until ADR-005 is explicitly amended.

---

## 19. Source of Truth

This file defines what VoiceOps is.

If implementation details conflict with this specification, stop and review
the discrepancy before continuing.

Changes to the product scope must be documented in DECISIONS.md.
