import logging
import os

from fastapi import APIRouter, HTTPException, Request
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import users as crud
from app.models.pydantic import UserSchema, WebsiteSchema, Product, UserProduct, ProductStrict

from pydantic import BaseModel

class LikeProduct(BaseModel):
    product_url: str

class LikeProductResponse(BaseModel):
    user_id: str
    product_url: str

router = APIRouter()

log = logging.getLogger("uvicorn")

@router.get("/", response_model=list[UserSchema])
async def read_users() -> list[UserSchema]:
    return await crud.get_all()

@router.get("/{id}/", response_model=UserSchema)
async def read_user(id: str) -> UserSchema:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/{user_id}/likes", response_model=list[UserProduct])
async def read_user_likes(user_id: str) -> list[UserProduct]:
    products = await crud.get_likes(user_id)
    return products

@router.post("/{user_id}/products", status_code=201, response_model=UserProduct) # history basically
async def add_product(user_id: str, product: ProductStrict) -> UserProduct:
    user_product = await crud.add_product(user_id, product)
    if user_product is None:
        raise HTTPException(status_code=404, detail="User not found!")

    return user_product


@router.post("/{user_id}/likes", status_code=201, response_model=LikeProductResponse)
async def add_like(user_id: str, product: LikeProduct) -> LikeProductResponse:
    product = await crud.add_like(user_id, product.product_url)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return LikeProductResponse(user_id=user_id, product_url=product)

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
