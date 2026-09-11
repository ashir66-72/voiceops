from fastapi import FastAPI
from sqlalchemy import text
from backend.database import engine

app = FastAPI(title="VoiceOps Backend")

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "database": db_status
    }