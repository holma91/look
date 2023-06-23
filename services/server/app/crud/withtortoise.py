import asyncio
from typing import Optional

from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class User(models.Model):
    id = fields.TextField(pk=True)
    favorites = fields.ManyToManyField(
        'models.Website', related_name='users', through='user_website'
    )

class Website(models.Model):
    domain = fields.TextField(pk=True)
    multi_brand = fields.BooleanField()
    second_hand = fields.BooleanField()

class Product(models.Model):
    product_url = fields.TextField(pk=True)
    website = fields.ForeignKeyField('models.Website', related_name='products')
    brand = fields.TextField()
    name = fields.TextField()
    price = fields.FloatField()
    currency = fields.TextField()
    updated_at = fields.DatetimeField(auto_now=True)


UserSchema = pydantic_model_creator(User)
WebsiteSchema = pydantic_model_creator(Website)

async def get(id: str) -> dict:
    user = await User.filter(id=id).first().values()
    if user:
        return user
    return None

async def get_favorites(id: str) -> list[WebsiteSchema]:
    user = await User.get(id=id)
    websites = await user.favorites.all()

    return await asyncio.gather(
        *(WebsiteSchema.from_tortoise_orm(website) for website in websites)
    )

async def get_likes(id: str) -> list:
    pass


async def add_favorite(user_id: str, website_id: str) -> Optional[WebsiteSchema]:
    user = await User.get(id=user_id)
    if user is None:
        return None
    website = await Website.get(domain=website_id)
    if website is None:
        return None
    await user.favorites.add(website)
    return website



async def un_favorite(user_id: str, website_id: str) -> Optional[str]:
    user = await User.get(id=user_id)
    website = await Website.get(domain=website_id)
    if user is None or website is None:
        return None
    await user.favorites.remove(website)
    return website.domain


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