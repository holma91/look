import logging

log = logging.getLogger("uvicorn")


class ProductionConfig:
    DEBUG = False
    TESTING = False
    APP_ENVIRONMENT = "cloud"
    _SQLALCHEMY_DATABASE_URI = None

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "<insert production database uri here>"


class DevelopmentConfig:
    DEBUG = True
    TESTING = False
    APP_ENVIRONMENT = "local"
    _SQLALCHEMY_DATABASE_URI = None

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "postgresql://postgres:postgres@web-db:5432/web_dev"


CONFIGS = {
    "production": ProductionConfig,
    "development": DevelopmentConfig,
}


def load_config():
    log.info("Loading config settings from the environment...")
    config = CONFIGS.get("development")
    if not config:
        raise Exception("Invalid APP_ENVIRONMENT")

    return config()
