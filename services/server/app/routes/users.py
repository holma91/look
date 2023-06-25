import logging
import os
from typing import Optional, Any

from fastapi import APIRouter, HTTPException, Request
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import users as crud
from app.models.pydantic import UserBase, UserExtended, UserLiked, UserHistory, ProductExtended, POSTResponse, LikeProduct
from app.utils import SUCCESSFUL_POST_RESPONSE

router = APIRouter()

log = logging.getLogger("uvicorn")

### GET REQUESTS ###

@router.get("/", response_model=list[UserBase])
async def read_users() -> list[UserBase]:
    return await crud.get_all()

@router.get("/{id}/", response_model=UserExtended)
async def read_user(id: str) -> UserExtended:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/{user_id}/likes", response_model=list[UserLiked])
async def read_user_likes(user_id: str) -> UserLiked:
    products = await crud.get_likes(user_id)
    return products

@router.get("/{user_id}/history", response_model=list[UserHistory])
async def read_user_history(user_id: str) -> UserHistory:
    products = await crud.get_history(user_id)
    return products

### POST & DELETE REQUESTS ###

@router.post("/{user_id}/products", status_code=201, response_model=POSTResponse) # history basically
async def add_product(user_id: str, product: ProductExtended) -> POSTResponse:
    success = await crud.add_product(user_id, product)
    if not success:
        raise HTTPException(status_code=404, detail="User not found!")

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
    

### Change the following to use the body of the requests instead

@router.post("/{user_id}/favorites/{website_id}", status_code=200, response_model=str)
async def add_favorite(user_id: str, website_id: str) -> str:
    website = await crud.add_favorite(user_id, website_id)
    if website is None:
        raise HTTPException(status_code=404, detail="User or Website not found!")

    return website

@router.delete("/{user_id}/favorites/{website_id}", status_code=204)
async def delete_favorite(user_id: str, website_id: str):
    result = await crud.un_favorite(user_id, website_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Website not found!")


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
