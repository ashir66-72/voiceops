import os
import requests
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
import httpx
from datetime import datetime, timezone, timedelta

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








def business_intelligence(db: Session, focus: str = "combined") -> dict:
    """
    Combines internal business metrics with external context.
    Returns an evidence package — facts, observations, and source attribution.
    Never invents conclusions. Agent reasons over the evidence.
    """

    result = {
        "focus": focus,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "internal_facts": {},
        "external_facts": {},
        "limitations": [],
    }

    # --- Internal: order trends ---
    try:
        from sqlalchemy import func as sqlfunc
        from backend.models import Order, OrderItem, Product, Review

        now = datetime(2026, 9, 30, tzinfo=timezone.utc)  # anchor date
        week_ago = now - timedelta(days=7)
        two_weeks_ago = now - timedelta(days=14)

        this_week_orders = db.query(Order).filter(
            Order.order_date >= week_ago
        ).count()

        last_week_orders = db.query(Order).filter(
            Order.order_date >= two_weeks_ago,
            Order.order_date < week_ago
        ).count()

        this_week_revenue = db.query(
            sqlfunc.coalesce(sqlfunc.sum(Order.total_amount), 0)
        ).filter(Order.order_date >= week_ago).scalar()

        # Top product this week
        top = (
            db.query(Product.name, sqlfunc.sum(OrderItem.quantity).label("qty"))
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.order_date >= week_ago)
            .group_by(Product.name)
            .order_by(sqlfunc.sum(OrderItem.quantity).desc())
            .first()
        )

        # Average rating this week vs last week
        this_week_rating = db.query(
            sqlfunc.avg(Review.rating)
        ).filter(Review.created_at >= week_ago).scalar()

        last_week_rating = db.query(
            sqlfunc.avg(Review.rating)
        ).filter(
            Review.created_at >= two_weeks_ago,
            Review.created_at < week_ago
        ).scalar()

        result["internal_facts"] = {
            "this_week_orders": this_week_orders,
            "last_week_orders": last_week_orders,
            "order_trend": "up" if this_week_orders >= last_week_orders else "down",
            "this_week_revenue": float(this_week_revenue),
            "top_product_this_week": top[0] if top else None,
            "avg_rating_this_week": round(float(this_week_rating), 2) if this_week_rating else None,
            "avg_rating_last_week": round(float(last_week_rating), 2) if last_week_rating else None,
        }
    except Exception as e:
        result["limitations"].append(f"Internal data unavailable: {str(e)}")

    # --- External: weather ---
    try:
        import httpx as _httpx
        weather_resp = _httpx.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": 42.2700919,
                "longitude": -88.0052408,
                "current": "temperature_2m,precipitation,weathercode,windspeed_10m",
                "temperature_unit": "fahrenheit",
                "timezone": "America/Chicago",
            },
            timeout=8,
        )
        if weather_resp.status_code == 200:
            current = weather_resp.json().get("current", {})
            wcode = current.get("weathercode", 0)
            if wcode == 0:
                condition = "clear"
            elif wcode <= 3:
                condition = "partly cloudy"
            elif wcode <= 67:
                condition = "rainy"
            elif wcode <= 77:
                condition = "snowy"
            else:
                condition = "stormy"

            result["external_facts"]["weather"] = {
                "condition": condition,
                "temperature_f": current.get("temperature_2m"),
                "precipitation_mm": current.get("precipitation"),
                "windspeed_mph": current.get("windspeed_10m"),
                "source": "open-meteo.com",
            }
        else:
            result["limitations"].append("Weather data unavailable")
    except Exception:
        result["limitations"].append("Weather source timed out")

    # --- External: nearby competitors ---
    try:
        import os
        geo_key = os.getenv("GEOAPIFY_API_KEY")
        if not geo_key:
            result["limitations"].append("GEOAPIFY_API_KEY not configured")
        else:
            geo_resp = _httpx.get(
                "https://api.geoapify.com/v2/places",
                params={
                    "categories": "catering.restaurant,catering.fast_food,catering.cafe",
                    "filter": "circle:-88.0052408,42.2700919,1000",
                    "limit": 20,
                    "apiKey": geo_key,
                },
                timeout=8,
            )
            if geo_resp.status_code == 200:
                features = geo_resp.json().get("features", [])
                # exclude Chicago Ramen itself
                competitors = [
                    f["properties"].get("name", "Unknown")
                    for f in features
                    if f["properties"].get("name") != "Chicago Ramen"
                ]
                result["external_facts"]["market"] = {
                    "competitors_within_1km": len(competitors),
                    "competitor_names": competitors[:5],
                    "source": "geoapify.com",
                    "attribution": "Powered by Geoapify | © OpenStreetMap contributors",
                }
            else:
                result["limitations"].append("Market data unavailable")
    except Exception:
        result["limitations"].append("Market source timed out")

    return result




@app.post("/tools/resolve_payment")
def post_resolve_payment(body: dict, db: Session = Depends(get_db)):
    return tools.resolve_payment(db, body["payment_id"])

@app.post("/tools/delete_note")
def post_delete_note(body: dict, db: Session = Depends(get_db)):
    return tools.delete_note(db, body["note_id"])


@app.get("/tools/business_intelligence")
def get_business_intelligence(
    focus: str = Query("combined"),
    db: Session = Depends(get_db),
):
    return tools.business_intelligence(db, focus)




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

@app.get("/test/weather")
async def test_weather():
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": BUSINESS_LAT,
        "longitude": BUSINESS_LON,
        "current": "temperature_2m,precipitation,weathercode,windspeed_10m",
        "temperature_unit": "fahrenheit",
        "timezone": "America/Chicago",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Open-Meteo error {resp.status_code}: {resp.text[:200]}"
        )

    data = resp.json()
    current = data.get("current", {})

    return {
        "location": "Mundelein, IL",
        "time": current.get("time"),
        "temperature_f": current.get("temperature_2m"),
        "precipitation_mm": current.get("precipitation"),
        "windspeed_mph": current.get("windspeed_10m"),
        "weathercode": current.get("weathercode"),
        "source": "open-meteo.com",
    }



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