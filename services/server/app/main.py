import logging

from fastapi import FastAPI, Depends

from app.routes import ping, companies, users, products
from app.db import init_db
from app.auth import get_current_user

log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()

    application.include_router(ping.router)
    application.include_router(users.router, prefix="/users", tags=["users"])
    application.include_router(products.router, prefix="/products", tags=["products"])
    application.include_router(companies.router, prefix="/companies", tags=["companies"])

    return application


app = create_application()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# @app.get("/user")
# def read_user(user = Depends(get_current_user)):
#     return user


# @app.get('/products', status_code=200, response_model=dict[str, list[product.ProductModel]])
# def products(db_session=Depends(get_db_session)):
#     return {
#             "results": product.list_all(db_session)
#     }


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")
    init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")