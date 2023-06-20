import logging

from functools import lru_cache
from pydantic import BaseSettings, AnyUrl

log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    environment: str = "dev"
    database_url: AnyUrl = None


# cache so that get_settings is only called when the environment changes
@lru_cache()
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()