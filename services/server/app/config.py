import os
import logging
from functools import lru_cache

from pydantic import BaseSettings

log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    environment: str = "dev"  # environment: str = os.getenv("ENVIRONMENT", "dev")
    testing: bool = False
    database_url: str = ""


@lru_cache()
def get_settings() -> Settings:
    log.info("Loading config settings from the environment...")
    env = os.getenv("ENVIRONMENT", "dev")
    if env == "prod":
        SUPABASE_DB_URL = os.environ.get("SUPABASE_DB_URL", "")
        return Settings(
            environment="prod",
            testing=False,
            database_url=SUPABASE_DB_URL,
        )

    DATABASE_URL = os.environ.get("DATABASE_URL", "")
    return Settings(database_url=DATABASE_URL)
