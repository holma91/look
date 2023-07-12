import os
import logging

import asyncpg
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.routes import ping, users, websites, products, companies
from app.db import init_db


log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()

    application.include_router(ping.router)
    application.include_router(users.router, prefix="/users", tags=["users"])
    application.include_router(websites.router, prefix="/websites", tags=["websites"])
    application.include_router(products.router, prefix="/products", tags=["products"])
    application.include_router(companies.router, prefix="/companies", tags=["companies"])

    return application


app = create_application()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")
    init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")