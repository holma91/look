import logging
import os

from fastapi import APIRouter, HTTPException, Request
from svix.webhooks import Webhook, WebhookVerificationError

from app.crud import websites as crud
from app.models.tortoise import UserSchema, WebsiteSchema


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[WebsiteSchema])
async def read_all_websites() -> list[WebsiteSchema]:
    return await crud.get_all()