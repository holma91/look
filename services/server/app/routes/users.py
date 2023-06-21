from fastapi import APIRouter, HTTPException

from app.crud import users as crud
from app.models.pydantic import UserResponseSchema, UserPayloadSchema
from app.models.tortoise import UserSchema


router = APIRouter()


@router.get("/{id}/", response_model=UserSchema)
async def read_user(id: str) -> UserSchema:
    user = await crud.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/", response_model=list[UserSchema])
async def read_all_users() -> list[UserSchema]:
    return await crud.get_all()

@router.post("/", response_model=UserResponseSchema, status_code=201)
async def create_user(payload: UserPayloadSchema) -> UserResponseSchema:
    id = await crud.post(payload)

    response_object = {
        "id": id,
    }
    return response_object
