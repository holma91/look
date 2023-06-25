from typing import Optional

from tortoise import Tortoise
from app.models.pydantic import Product, ProductStrict
from app.db import get_db_connection


async def get_all() -> list[ProductStrict]:
    async with get_db_connection() as conn:
        query = """SELECT * FROM product 
                LEFT JOIN product_image 
                ON product.url = product_image.product_url;"""
        result = await conn.execute_query_dict(query)

    products = {}

    for row in result:
        if row['url'] not in products:
            products[row['url']] = {
                'url': row['url'],
                'domain': row['domain'],
                'brand': row['brand'],
                'name': row['name'],
                'price': row['price'],
                'currency': row['currency'],
                'updated_at': row['updated_at'],
                'images': [],
            }

        # If there is an image, add it to the product's images.
        if row['image_url']:
            products[row['url']]['images'].append(row['image_url'])

    products_list = list(products.values())

    return products_list

async def get(id: str) -> ProductStrict:
    url = id.replace('|', '/')
    conn = Tortoise.get_connection("default")
    async with get_db_connection() as conn:
        query = """select * from product 
                left join product_image on product.url = product_image.product_url 
                where product.url = $1;"""
        
        result = await conn.execute_query_dict(query, [url])
        if not result: return None

    product = result[0]
    product['images'] = []

    for row in result:
        if row['image_url']:
            product['images'].append(row['image_url'])

    return product

async def add(product: ProductStrict) -> Optional[Product]:

    async with get_db_connection() as conn:
        check_query = """select * from product where url = $1;"""
        check_result = await conn.execute_query_dict(check_query, [product.url])
        if check_result:
            return Product(**check_result[0])
        
        # Insert product

        query = """
        insert into product (url, domain, brand, name, price, currency)
        values ($1, $2, $3, $4, $5, $6) returning *;
        """
        result = await conn.execute_query_dict(query, [
            product.url, product.domain, product.brand, product.name, product.price, product.currency
        ])

        # Insert images
        query = """
        insert into product_image (product_url, image_url)
        values ($1, $2) returning *;
        """
        for image in product.images:
            await conn.execute_query_dict(query, [product.url, image])

    return Product(**result[0]) if result else None

async def delete(id: str) -> bool:
    product_url = id.replace('|', '/')
    async with get_db_connection() as conn:
        check_query = """select * from product where url = $1;"""
        check_result = await conn.execute_query_dict(check_query, [product_url])

        if check_result:  # if product exists
            delete_query = """delete from product where url = $1;"""
            await conn.execute_query(delete_query, [product_url])
            return True
        else:
            return False