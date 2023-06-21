from app.models.tortoise import User
from app.models.pydantic import UserPayloadSchema

async def get(id: str) -> dict:
    user = await User.filter(id=id).first().values()
    if user:
        return user
    return None

async def get_all() -> list:
    users = await User.all().values()
    return users

# Below are the functions that will ONLY be called by the clerk webhook

async def create(id: str) -> int:
    user = User(
        id=id
    )
    await user.save()
    return user.id

async def update(id: str) -> int:
    return id

async def delete(id: str) -> int:
    user = await User.filter(id=id).first().delete()
    return user