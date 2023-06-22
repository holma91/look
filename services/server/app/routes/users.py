import logging
import os

from fastapi import APIRouter, HTTPException, Request
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import users as crud
from app.models.tortoise import UserSchema, WebsiteSchema


router = APIRouter()

log = logging.getLogger("uvicorn")

@router.get("/{id}/", response_model=UserSchema)
async def read_user(id: str) -> UserSchema:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/{id}/favorites", response_model=list[WebsiteSchema])
async def read_user_favorites(id: str) -> list[WebsiteSchema]:
    favorites = await crud.get_favorites(id)
    return favorites

@router.get("/{id}/likes", response_model=list[WebsiteSchema])
async def read_user_likes(id: str) -> list[WebsiteSchema]:
    pass

@router.get("/", response_model=list[UserSchema])
async def read_all_users() -> list[UserSchema]:
    return await crud.get_all()


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
