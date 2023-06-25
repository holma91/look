import logging
from typing import Optional
from fastapi import APIRouter, HTTPException

from app.crud import products as crud
from app.models.pydantic import ProductExtended, POSTResponse
from app.utils import SUCCESSFUL_POST_RESPONSE


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

@router.post("/", status_code=200, response_model=POSTResponse)
async def add_product(product: ProductExtended) -> POSTResponse:
    product = await crud.add(product)
    if product is None:
        raise HTTPException(status_code=404, detail="Product could not be created!")

    return SUCCESSFUL_POST_RESPONSE

@router.delete("/{id}/", status_code=204)
async def delete_product(id: str):
    success = await crud.delete(id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found!")