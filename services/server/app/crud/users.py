from typing import Optional
from tortoise import Tortoise
from tortoise.transactions import in_transaction

async def get_all() -> list[dict]:
    conn = Tortoise.get_connection("default")
    query = """
        select * from "user";
    """
    users = await conn.execute_query_dict(query)
    await conn.close()
    return users

async def get(id: str) -> dict:
    conn = Tortoise.get_connection("default")
    query = """
        select * from "user" u where u.id = $1;
    """
    users = await conn.execute_query_dict(query, [id])
    await conn.close()
    return users[0]


async def get_likes(user_id: str) -> list:
    conn = Tortoise.get_connection("default")
    query = """
    select * from user_product up 
    join product p on p.url = up.product_url
    where up.user_id = $1;
    """
    products = await conn.execute_query_dict(query, [user_id])
    await conn.close()
    return products

async def add_like(user_id: str, product_url: str) -> Optional[str]:
    query = """
    insert into user_product (user_id, product_url)
    values ($1, $2);
    """
    async with in_transaction("default") as tconn:
        await tconn.execute_query_dict(query, [user_id, product_url])

    return product_url

async def un_like(user_id: str, product_url: str) -> Optional[str]:
    query = """
    delete from user_product where user_id = $1 and product_url = $2;
    """
    async with in_transaction("default") as tconn:
        await tconn.execute_query_dict(query, [user_id, product_url])

    return product_url


async def add_favorite(user_id: str, website_id: str) -> Optional[str]:
    query = """
    insert into user_website (user_id, website_id)
    values ($1, $2);
    """
    async with in_transaction("default") as tconn:
        await tconn.execute_query_dict(query, [user_id, website_id])

    return website_id



async def un_favorite(user_id: str, website_id: str) -> Optional[str]:
    query = """
    delete from user_website where user_id = $1 and website_id = $2;
    """
    async with in_transaction("default") as tconn:
        await tconn.execute_query_dict(query, [user_id, website_id])

    return website_id


### CLERK WEBHOOK FUNCTIONS ###

async def create(id: str) -> int:
    conn = Tortoise.get_connection("default")
    query = """
    insert into "user" (id) values ($1);
    """
    await conn.execute_query_dict(query, [id])
    await conn.close()

    return id

async def update(id: str) -> int:
    return id

async def delete(id: str) -> int:
    conn = Tortoise.get_connection("default")
    query = """
    delete from "user" where id = $1;
    """
    await conn.execute_query_dict(query, [id])
    await conn.close()

    return id