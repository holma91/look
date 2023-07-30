from tortoise import Tortoise
from app.db import get_db_connection


async def get_all() -> list:
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

async def get(id: str) -> dict:
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