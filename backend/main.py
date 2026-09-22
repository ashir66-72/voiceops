import os
import requests
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
import httpx

from backend import tools
from backend.database import engine, get_db
from backend.schemas import AddNoteRequest, SendPaymentReminderRequest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="VoiceOps Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://voiceops-ffl0.onrender.com",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {"status": "ok", "database": db_status}


@app.get("/tools/business_snapshot")
def get_business_snapshot(db: Session = Depends(get_db)):
    return tools.business_snapshot(db)


@app.get("/tools/find_customer")
def get_find_customer(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    return {"matches": tools.find_customer(db, name)}


@app.get("/tools/overdue_payments")
def get_overdue_payments(db: Session = Depends(get_db)):
    return {"overdue_payments": tools.overdue_payments(db)}


@app.get("/tools/best_sellers")
def get_best_sellers(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return {"best_sellers": tools.best_sellers(db, limit)}


@app.post("/tools/add_note")
def post_add_note(payload: AddNoteRequest, db: Session = Depends(get_db)):
    result = tools.add_note(db, payload.customer_id, payload.content)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@app.post("/tools/send_payment_reminder")
def post_send_payment_reminder(
    payload: SendPaymentReminderRequest, db: Session = Depends(get_db)
):
    result = tools.send_payment_reminder(db, payload.payment_id)
    if not result["success"]:
        status_code = 404 if "No payment found" in result["error"] else 400
        raise HTTPException(status_code=status_code, detail=result["error"])
    return result

@app.get("/api/voice-token")
def get_voice_token():
    api_key = os.getenv("ASSEMBLYAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ASSEMBLYAI_API_KEY not configured on server")

    resp = requests.get(
        "https://agents.assemblyai.com/v1/token",
        headers={"Authorization": api_key},
        params={"expires_in_seconds": 60},
    )
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Could not mint voice token")

    return resp.json()

@app.get("/tools/activity_log")
def get_activity_log(limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    return {"activity_log": tools.recent_activity(db, limit)}





BUSINESS_LAT = 42.2700919
BUSINESS_LON = -88.0052408

@app.get("/test/geoapify")
async def test_geoapify():
    api_key = os.getenv("GEOAPIFY_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEOAPIFY_API_KEY not set")

    url = "https://api.geoapify.com/v2/places"
    params = {
        "categories": "catering.restaurant,catering.fast_food,catering.cafe",
        "filter": f"circle:{BUSINESS_LON},{BUSINESS_LAT},1000",
        "limit": 10,
        "apiKey": api_key,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Geoapify error {resp.status_code}: {resp.text[:200]}"
        )

    data = resp.json()
    features = data.get("features", [])

    places = []
    for f in features:
        props = f.get("properties", {})
        places.append({
            "name": props.get("name", "Unknown"),
            "category": props.get("categories", [None])[0],
            "distance_m": round(props.get("distance", 0)),
            "address": props.get("formatted", ""),
        })

    return {
        "business_location": {"lat": BUSINESS_LAT, "lon": BUSINESS_LON},
        "radius_m": 1000,
        "nearby_count": len(places),
        "places": places,
    }