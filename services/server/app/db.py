import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from app.config import load_config
from tortoise import Tortoise, run_async
from tortoise.contrib.fastapi import register_tortoise


log = logging.getLogger("uvicorn")

app_config = load_config()


def get_db_session():
    engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI, echo=False)
    db = sessionmaker(bind=engine)()

    try:
        yield db
    finally:
        db.close()


TORTOISE_ORM = {
    "connections": {"default": os.environ.get("DATABASE_URL")},
    "apps": {
        "models": {
            "models": ["aerich.models"],
            "default_connection": "default",
        },
    },
}


def init_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        db_url=os.environ.get("DATABASE_URL"),
        modules={"models": []},
        generate_schemas=False,
        add_exception_handlers=True,
    )


@asynccontextmanager
async def get_db_connection():
    conn = Tortoise.get_connection("default")
    try:
        yield conn
    finally:
        pass
        # await conn.close(), apparently this is done by Tortoise?


async def generate_schema() -> None:
    log.info("Initializing Tortoise...")

    await Tortoise.init(
        db_url=os.environ.get("DATABASE_URL"),
        # modules={"models": ["models.tortoise"]},
    )
    log.info("Generating database schema via Tortoise...")
    await Tortoise.generate_schemas()
    await Tortoise.close_connections()


# if we run this file directly, then we want to generate the schema
# maybe this is what we do in production?
if __name__ == "__main__":
    run_async(generate_schema())
