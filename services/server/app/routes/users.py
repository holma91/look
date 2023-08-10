import logging
import os
from typing import Optional, Any

from fastapi import APIRouter, HTTPException, Request, Depends, Query
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import users as crud
from app.models.pydantic import UserBase, UserCompany, UserBrand, ProductImages, UserProduct, ListBase, ListProducts, LikeProducts, FavoriteCompany, UserExtended, ProductExtended, POSTResponse, LikeProduct, WebsiteBase, ProductImage, POSTResponseAddImage
from app.utils import SUCCESSFUL_POST_RESPONSE

router = APIRouter()

log = logging.getLogger("uvicorn")

### GET REQUESTS ###

### USER INFO ###

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
    website: list[str] = Query(None)
) -> UserProduct:
    filters = {"list": list, "brand": brand, "website": website}
    try:
        if list in ["history", "likes"]:
            products = await crud.get_products(user_id, filters)
        else:
            products = await crud.get_products_from_list(user_id, filters)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return products

@router.get("/{user_id}/products/{product_url}", response_model=UserProduct)
async def read_user_product(user_id: str, product_url: str) -> UserProduct:
    product = await crud.get_product(user_id, product_url)
    if not product:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return product

@router.get("/{user_id}/product", response_model=UserProduct)
async def read_user_product(user_id: str, product_url: str = Query(None)) -> UserProduct:
    print('product_url', product_url)
    product = await crud.get_product(user_id, product_url)
    if not product:
        raise HTTPException(status_code=404, detail="User or Product not found!")

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

@router.post("/{user_id}/products", status_code=201, response_model=POSTResponse) # when seeing a new product
async def add_product(user_id: str, product: ProductExtended) -> POSTResponse:
    success = await crud.add_product(user_id, product)
    if not success:
        raise HTTPException(status_code=404, detail="User not found!")

    return SUCCESSFUL_POST_RESPONSE

# @router.post("/{user_id}/products/images", status_code=201, response_model=POSTResponseAddImage)
# async def add_product_image(user_id: str, product_image: ProductImage) -> POSTResponseAddImage:
#     result = await crud.add_product_image(product_image)
#     if not result['success']:
#         raise HTTPException(status_code=409, detail=result["message"])

#     return result

@router.post("/{user_id}/products/images", status_code=201, response_model=POSTResponseAddImage)
async def add_product_images(user_id: str, product_images: ProductImages) -> POSTResponseAddImage:
    result = await crud.add_product_images(product_images)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])

    return result

@router.delete("/{user_id}/products/images", status_code=204)
async def delete_product_images(user_id: str, product_images: ProductImages):
    result = await crud.delete_product_images(product_images)
    if not result['success']:
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

@router.post("/{user_id}/plists/{list_id}/products", status_code=201, response_model=POSTResponse)
async def add_products_to_p_list(user_id: str, list_products: ListProducts) -> POSTResponse:
    success = await crud.add_products_to_p_list(user_id, list_products)
    if not success:
        raise HTTPException(status_code=404, detail="User, List, or Product not found!")

    return SUCCESSFUL_POST_RESPONSE

@router.delete("/{user_id}/plists/{list_id}/products", status_code=204)
async def delete_products_from_p_list(user_id: str, list_id: str, list_products: ListProducts):
    if list_id == 'history':
        result = await crud.delete_products_from_history(user_id, list_products)
    elif list_id == 'likes':
        pass
    else:
        result = await crud.delete_products_from_p_list(user_id, list_products)
    if result is None:
        raise HTTPException(status_code=404, detail="User, List, or Product not found!")


### CLERK WEBHOOK ROUTES ###

WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET")

@router.post("/")
async def handle_user(request: Request) -> dict:
    """
    Handles a user webhook from Clerk
    """
    # verify webhook signature
    headers = request.headers
    payload = await request.body()

    try:
        wh = Webhook(WEBHOOK_SECRET)
        msg = wh.verify(payload, headers)
    except WebhookVerificationError as e:
        log.info("Invalid webhook signature: %s", e)
        raise HTTPException(status_code=400, detail="Invalid payload type")

    body = await request.json() 
    user_id = body['data']['id']

    if body['type'] == 'user.created':
        await crud.create(user_id)
    elif body['type'] == 'user.updated':
        await crud.update(user_id)
    elif body['type'] == 'user.deleted':
        await crud.delete(user_id)
    else:
        log.info("Invalid payload type: %s", body['type'])
        raise HTTPException(status_code=400, detail="Invalid payload type")
    
    return {"message": "User with id {user_id} updated"}
