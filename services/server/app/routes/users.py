import logging
from typing import Any
from fastapi import APIRouter, HTTPException, Request

from app.crud import users as crud
from app.models.pydantic import UserResponseSchema, UserPayloadSchema
from app.models.tortoise import UserSchema


router = APIRouter()

log = logging.getLogger("uvicorn")

@router.get("/{id}/", response_model=UserSchema)
async def read_user(id: str) -> UserSchema:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/", response_model=list[UserSchema])
async def read_all_users() -> list[UserSchema]:
    return await crud.get_all()

@router.post("/")
async def handle_user(request: Request) -> dict:
    body = await request.json() 
    print("payload.type:", body['type'])
    log.info("payload: %s", body)

    if body['type'] == 'user.created':
        crud.create(body['data']['id'])
    elif body['type'] == 'user.deleted':
        crud.delete(body['data']['id'])
    elif body['type'] == 'user.updated':
        pass
    
    return {"message": "Webhook received"}
