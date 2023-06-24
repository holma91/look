from tortoise import Tortoise

async def get_all() -> list[dict]:
    conn = Tortoise.get_connection("default")
    query = """select * from product;"""
    websites = await conn.execute_query_dict(query)
    return websites

async def get(id: str) -> dict:
    url = id.replace('|', '/')
    conn = Tortoise.get_connection("default")
    query = """select * from product where url = $1;"""
    product = await conn.execute_query_dict(query, [url])
    return product[0] if product else None