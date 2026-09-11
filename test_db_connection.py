from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text

load_dotenv()  # reads the .env file into environment variables

db_url = os.getenv("DATABASE_URL")

if not db_url:
    raise RuntimeError("DATABASE_URL not found — check your .env file")

engine = create_engine(db_url)

with engine.connect() as connection:
    result = connection.execute(text("SELECT 1"))
    print("Connection successful. Result:", result.fetchone())