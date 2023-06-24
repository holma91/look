import logging
from typing import Optional
from fastapi import APIRouter, HTTPException

from app.crud import products as crud
from app.models.pydantic import Product


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[Product])
async def read_all_products() -> list[Product]:
    return await crud.get_all()

@router.get("/{id}/", response_model=Product)
async def read_product(id: str) -> Product:
    product = await crud.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product