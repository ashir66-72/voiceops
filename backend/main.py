from fastapi import Depends, FastAPI, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend import tools
from backend.database import engine, get_db

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