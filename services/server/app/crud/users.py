from typing import Optional

from app.models.pydantic import ProductExtended, ProductImage

from app.crud import products as product_crud
from app.db import get_db_connection


async def get_all() -> list[dict]:
    async with get_db_connection() as conn:
        query = """
            select * from "user";
        """
        users = await conn.execute_query_dict(query)

    return users

async def get(id: str) -> dict:
    async with get_db_connection() as conn:
        user_query = """
            select * from "user" where id = $1;
        """
        user = await conn.execute_query_dict(user_query, [id])

        if not user:
            return None

        user = user[0]

        product_query = """
            select product_url from user_product where user_id = $1 and liked = TRUE;
        """
        liked_products = await conn.execute_query_dict(product_query, [id])

        website_query = """
            select website_id from user_website where user_id = $1;
        """
        favorite_websites = await conn.execute_query_dict(website_query, [id])

    user['likes'] = [product["product_url"] for product in liked_products]
    user['favorites'] = [website["website_id"] for website in favorite_websites]
    return user


async def add_product(user_id: str, product: ProductExtended) -> bool:
    # Adding a product from a user's perspective

    async with get_db_connection() as conn:
        # 1. add the actual product if it doesn't exist and it's images
        check_query = """select * from product where url = $1;"""
        check_result = await conn.execute_query_dict(check_query, [product.url])
        if check_result:
            return True
        
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
    
        # 3. add the user_product relationship
        check_query = """select * from user_product where user_id = $1 and product_url = $2;"""
        check_result = await conn.execute_query_dict(check_query, [user_id, product.url])
        if check_result:
            return True
        
        query = """
        insert into user_product (user_id, product_url)
        values ($1, $2);
        """
        await conn.execute_query_dict(query, [user_id, product.url])

    return True

async def add_product_image(product_image: ProductImage) -> bool:
    async with get_db_connection() as conn:
        query = """insert into product_image (product_url, image_url) values ($1, $2);"""
        result = await conn.execute_query_dict(query, [product_image.product_url, product_image.image_url])
    
    return True

async def get_likes(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            where up.user_id = $1 and liked = TRUE;
        """
        rows = await conn.execute_query_dict(query, [user_id])

    products_dict = {}
    for row in rows:
        product_url = row["product_url"]
        if product_url not in products_dict:
            product = {
                "url": product_url,
                "domain": row["domain"],
                "brand": row["brand"],
                "name": row["name"],
                "price": row["price"],
                "currency": row["currency"],
                "liked": row["liked"],
                "images": []
            }
            products_dict[product_url] = product

        # Add the image URL to the product's image list
        products_dict[product_url]["images"].append(row["image_url"])

    # Get a list of the products
    products = list(products_dict.values())

    return products

async def get_history(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            where up.user_id = $1;
        """
        rows = await conn.execute_query_dict(query, [user_id])

    products_dict = {}
    for row in rows:
        product_url = row["product_url"]
        if product_url not in products_dict:
            product = {
                "url": product_url,
                "domain": row["domain"],
                "brand": row["brand"],
                "name": row["name"],
                "price": row["price"],
                "currency": row["currency"],
                "liked": row["liked"],
                "images": []
            }
            products_dict[product_url] = product

        # Add the image URL to the product's image list
        products_dict[product_url]["images"].append(row["image_url"])

    # Get a list of the products
    products = list(products_dict.values())

    return products

async def get_purchased(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            where up.user_id = $1 and purchased = TRUE;
        """
        rows = await conn.execute_query_dict(query, [user_id])

    products_dict = {}
    for row in rows:
        product_url = row["product_url"]
        if product_url not in products_dict:
            product = {
                "url": product_url,
                "domain": row["domain"],
                "brand": row["brand"],
                "name": row["name"],
                "price": row["price"],
                "currency": row["currency"],
                "liked": row["liked"],
                "purchased": row["purchased"],
                "images": []
            }
            products_dict[product_url] = product

        # Add the image URL to the product's image list
        products_dict[product_url]["images"].append(row["image_url"])

    # Get a list of the products
    products = list(products_dict.values())

    return products

async def get_companies(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select uc.company_id, favorited, domain from user_company uc
            join website w on w.company_id = uc.company_id
            where uc.user_id = $1;
        """
        sites = await conn.execute_query_dict(query, [user_id])

    processed_data = {}
    for site in sites:
        company_id = site['company_id']

        if company_id not in processed_data:
            processed_data[company_id] = {
                "id": site["company_id"],
                "favorited": site["favorited"],
                "domains": []
            }

        processed_data[company_id]["domains"].append(site["domain"])

    return list(processed_data.values())

async def get_brands(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            SELECT DISTINCT brand FROM product 
            join user_product up on up.product_url = product.url where up.user_id = $1;
        """
        brands = await conn.execute_query_dict(query, [user_id])
    
    return brands


async def get_favorites(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select * from user_website uw 
            where uw.user_id = $1 and uw.favorited = TRUE;
        """
        favorites = await conn.execute_query_dict(query, [user_id])
    return favorites
    

async def add_like(user_id: str, product_url: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = TRUE where user_id = $1 and product_url = $2;
        """
        await conn.execute_query_dict(query, [user_id, product_url])

    return product_url

async def un_like(user_id: str, product_url: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = FALSE where user_id = $1 and product_url = $2;
        """

        await conn.execute_query_dict(query, [user_id, product_url])

    return product_url

async def add_favorite(user_id: str, id: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_company set favorited = TRUE where user_id = $1 and company_id = $2;
        """
        await conn.execute_query_dict(query, [user_id, id])

    return id

async def un_favorite(user_id: str, id: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_company set favorited = FALSE where user_id = $1 and company_id = $2;
        """

        await conn.execute_query_dict(query, [user_id, id])

    return id


### CLERK WEBHOOK FUNCTIONS ###

async def create(id: str) -> int:
    async with get_db_connection() as conn:
        query = """
        insert into "user" (id) values ($1);
        """
        await conn.execute_query_dict(query, [id])

    return id

async def update(id: str) -> int:
    return id

async def delete(id: str) -> int:
    async with get_db_connection() as conn:
        query = """
        delete from "user" where id = $1;
        """
        await conn.execute_query_dict(query, [id])

    return id