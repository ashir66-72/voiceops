from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend import tools
from backend.database import engine, get_db
from backend.schemas import AddNoteRequest, SendPaymentReminderRequest

app = FastAPI(title="VoiceOps Backend")


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