from app.models.tortoise import Website
from tortoise import Tortoise, run_async

async def create_website(domain: str, multi_brand: bool):
    await Tortoise.init(db_url="your_database_url", modules={"models": ["app.models.tortoise"]})
    await Tortoise.generate_schemas()
    website = await Website.create(domain=domain, multi_brand=multi_brand, second_hand=False)
    return website


async def create_websites():
    starting_sites = [('zara.com', False), ('zalando.com', True), ('boozt.com', True), ('hm.com', False)]
    for (domain, multi_brand) in starting_sites:
        await create_website(domain, multi_brand)


if __name__ == '__main__':
    run_async(create_websites())

# don't know how I run this fcking script in docker