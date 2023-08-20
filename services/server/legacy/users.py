import logging
import os
from typing import Optional, Any

from fastapi import APIRouter, HTTPException, Request, Depends, Query
from svix.webhooks import Webhook, WebhookVerificationError

from app.legacy import users as crud
from legacy.pydantic import (
    UserBase,
    UserCompany,
    UserBrand,
    ProductImages,
    UserProduct,
    ListBase,
    ListProducts,
    LikeProducts,
    FavoriteCompany,
    UserExtended,
    ProductExtended,
    POSTResponse,
    LikeProduct,
    WebsiteBase,
    ProductImage,
    POSTResponseAddImage,
)
from app.utils import SUCCESSFUL_POST_RESPONSE
from app.auth import get_current_user

router = APIRouter()

log = logging.getLogger("uvicorn")

### GET REQUESTS ###
# create, read, update, delete vs add, get, change, remove
### USER INFO ###


@router.post("/", status_code=201, response_model=POSTResponse)
async def create_user(user: UserBase) -> POSTResponse:
    # verify the firebase token/id
    result = await crud.create(user.id)
    if result is None:
        raise HTTPException(status_code=400, detail="User already exists!")

    return SUCCESSFUL_POST_RESPONSE


@router.get("/", response_model=list[UserBase])
async def read_users() -> list[UserBase]:
    return await crud.get_all()


@router.get("/{id}/", response_model=UserExtended)
async def read_user(id: str) -> UserExtended:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


### PRODUCT INFO ###


@router.get("/{user_id}/products", response_model=list[UserProduct])
async def read_user_products(
    user_id: str,
    list: str = "likes",
    brand: list[str] = Query(None),
    website: list[str] = Query(None),
    user: dict = Depends(get_current_user),
) -> UserProduct:
    filters = {"list": list, "brand": brand, "website": website}
    if list in ["history", "likes"]:
        products = await crud.get_products(user_id, filters)
    else:
        products = await crud.get_products_from_list(user_id, filters)
    return products


@router.get("/{user_id}/product", response_model=UserProduct)
async def read_user_product(
    user_id: str, product_url: str = Query(None)
) -> UserProduct:
    product = await crud.get_product(user_id, product_url)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found!")

    return product


### COMPANY INFO ###


@router.get("/{user_id}/companies", response_model=list[UserCompany])
async def read_user_companies(user_id: str) -> list[UserCompany]:
    companies = await crud.get_companies(user_id)
    return companies


@router.post("/{user_id}/favorites", status_code=201, response_model=POSTResponse)
async def add_favorite(user_id: str, company: FavoriteCompany) -> POSTResponse:
    product = await crud.add_favorite(user_id, company.id)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Company not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.delete("/{user_id}/favorites", status_code=204)
async def delete_favorite(user_id: str, company: FavoriteCompany):
    result = await crud.un_favorite(user_id, company.id)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Company not found!")


### BRAND INFO ###


@router.get("/{user_id}/brands", response_model=list[UserBrand])
async def read_user_brands(user_id: str) -> list[UserBrand]:
    brands = await crud.get_brands(user_id)
    return brands


### POST & DELETE REQUESTS ###

### PRODUCT INFO ###


@router.post(
    "/{user_id}/products", status_code=201, response_model=dict
)  # when seeing a new product
async def add_product(user_id: str, product: ProductExtended) -> dict:
    success = await crud.add_product(user_id, product)
    if not success:
        raise HTTPException(status_code=404, detail="User not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.post("/{user_id}/products/images", status_code=201, response_model=dict)
async def add_product_images(user_id: str, product_images: ProductImages) -> dict:
    result = await crud.add_product_images(product_images)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["message"])

    return result


@router.delete("/{user_id}/products/images", status_code=204)
async def delete_product_images(user_id: str, product_images: ProductImages):
    result = await crud.delete_product_images(product_images)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["message"])


@router.post("/{user_id}/likes", status_code=201, response_model=POSTResponse)
async def add_likes(user_id: str, products: LikeProducts) -> POSTResponse:
    product = await crud.like_products(user_id, products)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.delete("/{user_id}/likes", status_code=204)
async def delete_likes(user_id: str, products: LikeProducts):
    result = await crud.dislike_products(user_id, products)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")


### LISTS ###
@router.get("/{user_id}/plists", response_model=list[ListBase])
async def read_user_p_lists(user_id: str) -> list[ListBase]:
    lists = await crud.get_p_lists(user_id)
    return lists


@router.post("/{user_id}/plists", status_code=201, response_model=POSTResponse)
async def add_p_list(user_id: str, p_list: ListProducts) -> POSTResponse:
    success = await crud.create_p_list(user_id, p_list)
    if not success:
        raise HTTPException(status_code=404, detail="User not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.delete("/{user_id}/plists", status_code=204)
async def delete_p_list(user_id: str, p_list: ListBase):
    result = await crud.delete_p_list(user_id, p_list)
    if result is None:
        raise HTTPException(status_code=404, detail="User or List not found!")


@router.post(
    "/{user_id}/plists/{list_id}/products", status_code=201, response_model=dict
)
async def add_products_to_p_list(user_id: str, list_products: ListProducts):
    success = await crud.add_products_to_p_list(user_id, list_products)
    if not success:
        raise HTTPException(status_code=404, detail="User, List, or Product not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.delete("/{user_id}/plists/{list_id}/products", status_code=204)
async def delete_products_from_p_list(
    user_id: str, list_id: str, list_products: ListProducts
):
    if list_id == "history":
        result = await crud.delete_products_from_history(user_id, list_products)
    elif list_id == "likes":
        pass
    else:
        result = await crud.delete_products_from_p_list(user_id, list_products)
    if result is None:
        raise HTTPException(status_code=404, detail="User, List, or Product not found!")
