import os
import json
import logging

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from starlette.testclient import TestClient

from app.main import create_application
from app.config import get_settings, Settings
from app.database.db import get_db_session
from app.auth import get_current_user, FirebaseUser


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_current_user_override():
    test_user_uid = "CoRDzg4muzOJ5IVfGOtwSjIR8Mo1"
    return FirebaseUser(
        name="Test User",
        picture="http://example.com/picture.jpg",
        iss="...",
        aud="...",
        auth_time=1619530795,
        user_id=test_user_uid,
        sub="test_sub",
        iat=1619530795,
        exp=1619534395,
        email="test@example.com",
        email_verified=True,
        firebase={"key": "value"},
        uid=test_user_uid,
    )


def get_settings_override():
    database_url = os.environ.get("DATABASE_TEST_URL", "")
    logger.info(f"Using database URL: {database_url}")
    return Settings(
        environment="test",
        testing=True,
        database_url=database_url,
    )


def get_db_session_override():
    DATABASE_URL = os.environ.get("DATABASE_TEST_URL", "")
    engine = create_engine(DATABASE_URL, echo=False)
    db = sessionmaker(bind=engine)()

    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="module")
def test_app():
    app = create_application()
    app.dependency_overrides[get_current_user] = get_current_user_override
    app.dependency_overrides[get_settings] = get_settings_override
    app.dependency_overrides[get_db_session] = get_db_session_override
    with TestClient(app) as test_client:
        yield test_client
