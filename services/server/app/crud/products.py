from typing import Optional

from tortoise import Tortoise
from app.models.pydantic import Product

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

async def add(product: Product) -> Optional[str]:
    conn = Tortoise.get_connection("default")
    query = """
    insert into product (url, domain, brand, name, price, currency)
    values ($1, $2, $3, $4, $5, $6) returning *;
    """
    result = await conn.execute_query_dict(query, [
        product.url, product.domain, product.brand, product.name, product.price, product.currency
    ])

    return Product(**result[0]) if result else None

async def delete(id: str) -> bool:
    product_url = id.replace('|', '/')
    conn = Tortoise.get_connection("default")

    check_query = """select * from product where url = $1;"""
    check_result = await conn.execute_query_dict(check_query, [product_url])

    if check_result:  # if product exists
        delete_query = """delete from product where url = $1;"""
        await conn.execute_query(delete_query, [product_url])
        return True
    else:
        return False