"""
Updates the existing VoiceOps stored agent on AssemblyAI, pointing all
six MASTER_SPEC tools at the live Render backend instead of ngrok.

Uses PUT, not POST — this updates agent_0b8e9da298d542c6989819231c753a01
in place. Running this again is safe; it always targets the same agent.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
BASE_URL = os.getenv("PUBLIC_BASE_URL")
AGENT_ID = os.getenv("ASSEMBLYAI_AGENT_ID")

if not API_KEY:
    raise RuntimeError("ASSEMBLYAI_API_KEY not found — check your .env file")
if not BASE_URL:
    raise RuntimeError("PUBLIC_BASE_URL not found — check your .env file")
if not AGENT_ID:
    raise RuntimeError("ASSEMBLYAI_AGENT_ID not found — check your .env file")

SYSTEM_PROMPT = """You are VoiceOps, the voice business operator for Urban Bites,
a small restaurant business. You help the owner check business information
and perform a small set of routine actions by voice.

Rules you must always follow:
- Never invent  a business number but you can guess, customer detail, or payment status.
  Always call the matching tool to get real data before answering.
- If a tool call fails or returns no data, say so plainly. Do not make something up.
- For add_note and send_payment_reminder (state-changing actions): first
  identify the exact customer or payment involved, state clearly what you are
  about to do, and ask the owner to confirm before calling the tool. Only call
  the tool after the owner clearly confirms.
- send_payment_reminder only simulates a reminder inside the system. Never
  claim that a real WhatsApp message, SMS, or email was actually sent.
- Keep spoken answers short and clear, suitable for someone listening, not reading.
"""

TOOLS = [
    {
        "name": "business_snapshot",
        "description": "Get a high-level summary of the business: total customers, total orders, total revenue, and overdue payment counts. Use this for requests like 'give me today's business summary.'",
        "parameters": {"type": "object", "properties": {}, "required": []},
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/business_snapshot", "http_method": "GET", "headers": []},
    },
    {
        "name": "find_customer",
        "description": "Search for a customer by name (partial match allowed). Use this when the owner asks to find a specific customer, e.g. 'find Ahmed Khan.'",
        "parameters": {
            "type": "object",
            "properties": {"name": {"type": "string", "description": "Full or partial customer name to search for."}},
            "required": ["name"],
        },
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/find_customer", "http_method": "GET", "headers": []},
    },
    
    {
    "name": "business_intelligence",
    "description": (
        "Get a combined business intelligence report for Chicago Ramen. "
        "Combines internal metrics (order trends, revenue, top products, "
        "customer ratings) with external context (live weather in Mundelein IL, "
        "nearby competitor count). Use this when the owner asks questions like: "
        "'How are we doing this week?', 'Is there anything outside our system "
        "worth knowing?', 'How competitive is our area?', or any question that "
        "benefits from context beyond just the database. "
        "Always clearly separate internal facts from external observations. "
        "Never claim that external factors caused business outcomes — say "
        "'may be relevant' or 'coincides with'."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "focus": {
                "type": "string",
                "enum": ["combined", "weather", "market"],
                "description": "What to focus on. Default is combined.",
                "default": "combined",
            }
        },
        "required": [],
    },
    "execution_mode": "interactive",
    "timeout_seconds": 30,
    "http": {
        "url": f"{BASE_URL}/tools/business_intelligence",
        "http_method": "GET",
        "headers": []
    },
},
    
    {
        "name": "overdue_payments",
        "description": "List all payments that are currently overdue (past their due date and unpaid). Use this for requests like 'who owes us money?' Do not use for payments that are merely pending/not yet due.",
        "parameters": {"type": "object", "properties": {}, "required": []},
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/overdue_payments", "http_method": "GET", "headers": []},
    },
    {
        "name": "best_sellers",
        "description": "Get the top-selling products ranked by total quantity sold. Use this for requests like 'which product sells the most?'",
        "parameters": {
            "type": "object",
            "properties": {"limit": {"type": "integer", "description": "How many top products to return.", "default": 5}},
            "required": [],
        },
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/best_sellers", "http_method": "GET", "headers": []},
    },
    {
        "name": "add_note",
        "description": "Add a note to a specific customer's record. Only call this after confirming the exact customer and note content with the owner.",
        "parameters": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "integer", "description": "The exact numeric ID of the customer, found via find_customer first."},
                "content": {"type": "string", "description": "The note text to record."},
            },
            "required": ["customer_id", "content"],
        },
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/add_note", "http_method": "POST", "headers": []},
    },
    {
        "name": "send_payment_reminder",
        "description": "Record a simulated payment reminder for a specific overdue or pending payment. Only call this after confirming the exact customer, amount, and intent with the owner. Never claim a real message was sent — this only records the action internally.",
        "parameters": {
            "type": "object",
            "properties": {"payment_id": {"type": "integer", "description": "The exact numeric ID of the payment, found via overdue_payments first."}},
            "required": ["payment_id"],
        },
        "execution_mode": "interactive",
        "timeout_seconds": 15,
        "http": {"url": f"{BASE_URL}/tools/send_payment_reminder", "http_method": "POST", "headers": []},
    },
]


def update():
    resp = requests.put(
        f"https://agents.assemblyai.com/v1/agents/{AGENT_ID}",
        headers={"Authorization": API_KEY, "Content-Type": "application/json"},
        json={
            "name": "VoiceOps — Urban Bites",
            "system_prompt": SYSTEM_PROMPT,
            "greeting": "Hi, I'm VoiceOps. How can I help with Urban Bites today?",
            "voice": {"voice_id": "alba"},
            "tools": TOOLS,
        },
    )
    resp.raise_for_status()
    data = resp.json()
    print("Agent updated successfully.")
    print("agent_id:", data["id"])
    return data


if __name__ == "__main__":
    update()