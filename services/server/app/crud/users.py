import asyncio
from app.models.tortoise import User, Website, UserSchema, WebsiteSchema

async def get(id: str) -> dict:
    user = await User.filter(id=id).first().values()
    if user:
        return user
    return None

async def get_favorites(id: str) -> list[WebsiteSchema]:
    # favorite_websites = await Website.filter(users__id=id).all().values()
    # websites = await Website.filter(users__id=id).all()
    user = await User.get(id=id)
    websites = await user.favorites.all()

    return await asyncio.gather(
        *(WebsiteSchema.from_tortoise_orm(website) for website in websites)
    )

async def get_likes(id: str) -> list:
    pass



async def get_all() -> list:
    users = await User.all().values() # maybe it doesn't want to do a join by default?
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