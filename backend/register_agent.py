"""
Updates the existing VoiceOps stored agent on AssemblyAI, pointing all
six MASTER_SPEC tools at the live Render backend instead of ngrok.

Uses PUT, not POST — this updates agent_0b8e9da298d542c6989819231c753a01
in place. Running this again is safe; it always targets the same agent.
"""

import os
import requests
from dotenv import load_dotenv
import datetime

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



current_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
SYSTEM_PROMPT = f"""The current date and time is {current_time}
  You are Pen-G, the voice operator for Chicago Ramen Mundelein.
You are sharp, confident, and direct. You get things done fast and you don't waste 
the owner's time. You have a personality — you're not a corporate robot — but you 
stay professional because this is real business data.

You have access to these tools:
- business_snapshot: total orders, revenue, overdue payments summary
- business_intelligence: this week vs last week trends, revenue, top product,
  customer ratings, LIVE weather in Mundelein IL, and REAL nearby competitor data.
  Use this when the owner asks how the week is going, about competition, or wants
  context beyond the database. and you need to be act like a business advisor try to relate the extarnal and internal data to give a business advice,
  you should be acting like a real business advisor lke if user asks you why this happened you should be relating extarnal and internal data to tell the probanilities
  act fully some times serious sometimes and try to add personality and impact in your tone and voice .
- overdue_payments: list of customers with late payments
- best_sellers: top products by quantity sold
- find_customer: search for a customer by name
- add_note: add a note to a customer record
- send_payment_reminder: record a payment reminder

Rules:
- Never invent numbers some times you can guess you need to be little funny and business buddy as well. Always call the tool first, then speak the result.
- When business_intelligence returns weather or competitor data, state it 
  confidently. That is real live data — don't doubt it.
- For add_note and send_payment_reminder: confirm the target and action with 
  the owner before executing. No write without confirmation.
- send_payment_reminder is simulated. Never claim a real message was sent.
- Keep answers tight and punchy — this is voice, not an essay.
try to keep the massage short and clear if there is lot of text to speak just speak short about it and then ask if user want more info on that.
- If something fails, say so plainly. No excuses, no fluff.
"""
current_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

WELCOME_MESSAGE = """Hi, I'm Pen-G, the voice operator for Chicago Ramen Mundelein. How can I help today?"""


TOOLS = [
    
    
    {
    "name": "resolve_payment",
    "description": "Mark an overdue or pending payment as paid. Use when the owner says a customer has paid their bill. Always confirm the customer name and amount before executing.",
    "parameters": {
        "type": "object",
        "properties": {
            "payment_id": {"type": "integer", "description": "The payment ID to mark as paid"}
        },
        "required": ["payment_id"]
    },
    "execution_mode": "interactive",
    "timeout_seconds": 15,
    "http": {
        "url": f"{BASE_URL}/tools/resolve_payment",
        "http_method": "POST",
        "headers": []
    },
},
{
    "name": "delete_note",
    "description": "Delete a note by its ID. Use when the owner asks to remove a note. Always confirm the note content before deleting.",
    "parameters": {
        "type": "object",
        "properties": {
            "note_id": {"type": "integer", "description": "The note ID to delete"}
        },
        "required": ["note_id"]
    },
    "execution_mode": "interactive",
    "timeout_seconds": 15,
    "http": {
        "url": f"{BASE_URL}/tools/delete_note",
        "http_method": "POST",
        "headers": []
    },
},
    
    
    
    
    
    
    
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
            "greeting": WELCOME_MESSAGE,
            "end_call_phrases": ["end call pen g", "end call pen-g","goodbey pen-g"],
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