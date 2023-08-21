import os

import pytest
from starlette.testclient import TestClient

from app.main import create_application
from app.config import get_settings, Settings
from app.auth import get_current_user, FirebaseUser


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
    return Settings(
        environment="test",
        testing=True,
        database_url=os.environ.get("DATABASE_TEST_URL", ""),
    )


@pytest.fixture(scope="module")
def test_app():
    app = create_application()
    app.dependency_overrides[get_current_user] = get_current_user_override
    app.dependency_overrides[get_settings] = get_settings_override
    with TestClient(app) as test_client:
        yield test_client
