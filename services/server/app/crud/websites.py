import asyncio
from app.models.tortoise import Website, WebsiteSchema

async def get_all() -> list:
    websites = await Website.all().values()
    return websites