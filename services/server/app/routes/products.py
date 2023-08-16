import logging
from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session
from app.auth import get_current_user, FirebaseUser
from app.db import get_db_session
from app.pydantic.models import Product
from app.database import product_db


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[Product])
async def read_all_products(user: FirebaseUser = Depends(get_current_user), session = Depends(get_db_session)) -> list[Product]:
    return product_db.list_all(user, session)


@router.post("/", status_code=201, response_model=Product)
async def add_product(product: Product, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)) -> Product:
    created_product = product_db.add_product(product, user.uid, session)
    return created_product
