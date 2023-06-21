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

async def post(payload: UserPayloadSchema) -> int:
    user = User(
        id=payload.user_id
    )
    await user.save()
    return user.id