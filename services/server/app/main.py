import logging

from fastapi import FastAPI,Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.routes import ping, companies, users
from app.db import init_db
from .config import load_config
from app.database import product_db

log = logging.getLogger("uvicorn")

app_config = load_config()

def create_application() -> FastAPI:
    application = FastAPI()

    application.include_router(ping.router)
    application.include_router(users.router, prefix="/users", tags=["users"])
    # application.include_router(products.router, prefix="/products", tags=["products"])
    application.include_router(companies.router, prefix="/companies", tags=["companies"])

    return application

def get_db_session():
    engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI, echo=False)
    db = sessionmaker(bind=engine)()

    try:
        yield db
    finally:
        db.close()


app = create_application()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get('/products', status_code=200, response_model=dict)
def products(db_session=Depends(get_db_session)):
    return {
            "results": [
                product.dict() for product in product_db.list_all(db_session)
            ]
        }


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")
    init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")