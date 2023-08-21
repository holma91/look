import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from app.config import get_settings


log = logging.getLogger("uvicorn")

app_settings = get_settings()


def get_db_session():
    engine = create_engine(app_settings.database_url, echo=False)
    db = sessionmaker(bind=engine)()

    try:
        yield db
    finally:
        db.close()
