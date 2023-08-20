import logging

from fastapi import FastAPI, HTTPException

from app.routes import ping, companies, products

log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()

    application.include_router(ping.router)
    application.include_router(products.router, prefix="/products", tags=["products"])
    application.include_router(
        companies.router, prefix="/companies", tags=["companies"]
    )

    return application


app = create_application()


@app.get("/")
def read_root():
    raise HTTPException(
        status_code=302,
        headers={"Location": "/docs"},
    )


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")
