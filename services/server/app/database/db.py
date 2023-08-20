import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from app.config import load_config


log = logging.getLogger("uvicorn")

app_config = load_config()


def get_db_session():
    engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI, echo=False)
    db = sessionmaker(bind=engine)()

    try:
        yield db
    finally:
        db.close()
