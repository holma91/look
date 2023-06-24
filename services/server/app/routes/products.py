import logging
from typing import Optional
from fastapi import APIRouter, HTTPException

from app.crud import products as crud
from app.models.pydantic import Product, ProductStrict


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[ProductStrict])
async def read_all_products() -> list[ProductStrict]:
    return await crud.get_all()

@router.get("/{id}/", response_model=ProductStrict)
async def read_product(id: str) -> ProductStrict:
    product = await crud.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

@router.post("/", status_code=200, response_model=Product)
async def add_product(product: ProductStrict) -> Product:
    # call this whenever a user views a product
    product = await crud.add(product)
    if product is None:
        raise HTTPException(status_code=404, detail="Product could not be created!")

    return product

@router.delete("/{id}/", status_code=204)
async def delete_product(id: str):
    # basically never call this
    deleted = await crud.delete(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found!")