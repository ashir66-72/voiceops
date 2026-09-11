from backend.database import engine, Base
from backend import models  # noqa: F401 — import registers the models with Base

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")