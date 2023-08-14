import os
import logging
from functools import lru_cache

from pydantic import BaseSettings, AnyUrl


log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    environment: str = "dev"
    testing: bool = 0
    database_url: AnyUrl = None


@lru_cache()
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()


### What we actually use ###


class DevelopmentConfig:
    DEBUG = True
    TESTING = False
    APP_ENVIRONMENT = "local"
    _SQLALCHEMY_DATABASE_URI = None

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "postgresql://postgres:postgres@web-db:5432/web_dev"
    

CONFIGS = {
    "development": DevelopmentConfig,
}

def load_config():
    return CONFIGS.get("development")()