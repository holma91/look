import logging
from fastapi import APIRouter, HTTPException, Depends

from app.models.pydantic import ProductExtended
from app.auth import get_current_user, FirebaseUser
from app.db import get_db_session
from app.pydantic.models import Product
from app.database import product_db


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[Product])
async def read_all_products(user: FirebaseUser = Depends(get_current_user), session = Depends(get_db_session)) -> list[Product]:
    return product_db.list_all(user, session)

# @router.get("/{id}/", response_model=ProductExtended)
# async def read_product(id: str) -> ProductExtended:
#     product = await crud.get(id)
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     return product