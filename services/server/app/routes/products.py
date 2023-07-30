import logging
from fastapi import APIRouter, HTTPException

from app.crud import products as crud
from app.models.pydantic import ProductExtended


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[ProductExtended])
async def read_all_products() -> list[ProductExtended]:
    return await crud.get_all()

@router.get("/{id}/", response_model=ProductExtended)
async def read_product(id: str) -> ProductExtended:
    product = await crud.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product