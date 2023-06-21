import os
import logging

from fastapi import FastAPI
import asyncpg

from app.api import ping, summaries, users
from app.db import init_db


log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()
    application.include_router(ping.router)
    application.include_router(summaries.router, prefix="/summaries", tags=["summaries"])
    application.include_router(users.router, prefix="/users", tags=["users"])

    return application


app = create_application()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")
    init_db(app)
    app.db = await asyncpg.connect(os.environ.get("DATABASE_URL"))
    print("app.db: ", app.db)


@app.on_event("shutdown")
async def shutdown_event():
    await app.db.close()
    log.info("Shutting down...")