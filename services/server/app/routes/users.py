import logging
import os
from typing import Optional, Any

from fastapi import APIRouter, HTTPException, Request, Depends, Query
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import users as crud
from app.models.pydantic import UserBase, UserProduct, FavoriteCompany, UserExtended, ProductExtended, POSTResponse, LikeProduct, WebsiteBase, ProductImage
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

def get_filters(request: Request):
    return dict(request.query_params)


@router.get("/{user_id}/products", response_model=list[UserProduct])
async def read_user_products(
    user_id: str, 
    view: str = "likes",
    brand: list[str] = Query(None),
    website: list[str] = Query(None)
) -> UserProduct:
    print("brand:",brand)
    filters = {"view": view, "brand": brand, "website": website}
    print(filters)
    try:
        products = await crud.get_products(user_id, filters)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return products

### WEBSITE INFO ###

@router.get("/{user_id}/websites", response_model=list[Any])
async def read_user_websites(user_id: str) -> list[Any]:
    sites = await crud.get_websites(user_id)
    return sites

@router.get("/{user_id}/favorites", response_model=list[Any])
async def read_user_favorites(user_id: str) -> list[Any]:
    sites = await crud.get_favorites(user_id)
    return sites

### COMPANY INFO ###
@router.get("/{user_id}/companies", response_model=list[Any])
async def read_user_companies(user_id: str) -> list[Any]:
    companies = await crud.get_companies(user_id)
    return companies


### BRAND INFO ###
@router.get("/{user_id}/brands", response_model=list[Any])
async def read_user_brands(user_id: str) -> list[Any]:
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

@router.post("/{user_id}/products/images", status_code=201, response_model=POSTResponse)
async def add_product_image(user_id: str, product_image: ProductImage) -> POSTResponse:
    success = await crud.add_product_image(product_image)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found!")

    return SUCCESSFUL_POST_RESPONSE




@router.post("/{user_id}/likes", status_code=201, response_model=POSTResponse)
async def add_like(user_id: str, product: LikeProduct) -> POSTResponse:
    product = await crud.add_like(user_id, product.product_url)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return SUCCESSFUL_POST_RESPONSE

@router.delete("/{user_id}/likes", status_code=204)
async def delete_like(user_id: str, product: LikeProduct):
    result = await crud.un_like(user_id, product.product_url)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

### WEBSITE INFO ###

@router.post("/{user_id}/websites", status_code=201, response_model=POSTResponse) # when seeing a new website
async def add_product(user_id: str, website: WebsiteBase) -> POSTResponse:
    success = await crud.add_website(user_id, website)
    if not success:
        raise HTTPException(status_code=404, detail="User not found!")

    return SUCCESSFUL_POST_RESPONSE
    
@router.post("/{user_id}/favorites", status_code=201, response_model=POSTResponse)
async def add_favorite(user_id: str, company: FavoriteCompany) -> POSTResponse:
    product = await crud.add_favorite(user_id, company.id)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Company not found!")

    return SUCCESSFUL_POST_RESPONSE

@router.delete("/{user_id}/favorites", status_code=204)
async def delete_like(user_id: str, company: FavoriteCompany):
    result = await crud.un_favorite(user_id, company.id)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Company not found!")

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
