# from typing import Optional
# from app.models.pydantic import (
#     ProductExtended,
#     ProductImages,
#     LikeProducts,
#     ProductImage,
#     ListBase,
#     ListProduct,
#     ListProducts,
# )
# from app.database.db import get_db_connection


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

    user["likes"] = [product["product_url"] for product in liked_products]
    user["favorites"] = [website["website_id"] for website in favorite_websites]
    return user


### COMPANY INFO ###


async def get_companies(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select uc.company_id, favorited, domain from user_company uc
            join website w on w.company_id = uc.company_id
            where uc.user_id = $1
            order by uc.company_id;
        """
        sites = await conn.execute_query_dict(query, [user_id])

    processed_data = {}
    for site in sites:
        company_id = site["company_id"]

        if company_id not in processed_data:
            processed_data[company_id] = {
                "id": site["company_id"],
                "favorited": site["favorited"],
                "domains": [],
            }

        processed_data[company_id]["domains"].append(site["domain"])

    return list(processed_data.values())


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


### PRODUCT INFO ###


async def get_products_from_list(
    user_id: str, filters: Optional[dict[str, str]] = None
):
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join list_product lp on lp.product_url = up.product_url
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            join website w on p.domain = w.domain
            where up.user_id = $1 and lp.list_id = $2"""
        query_params = [user_id, filters["list"]]

        if filters:
            for key, value in filters.items():
                if key == "brand":
                    if value:
                        brand_placeholders = ", ".join(
                            f"${i+len(query_params)+1}" for i in range(len(value))
                        )
                        query += f" and brand = ANY(ARRAY[{brand_placeholders}])"
                        query_params.extend(value)
                elif key == "website":
                    if value:
                        website_placeholders = ", ".join(
                            f"${i+len(query_params)+1}" for i in range(len(value))
                        )
                        query += f" and company_id = ANY(ARRAY[{website_placeholders}])"
                        query_params.extend(value)
                elif key == "category":
                    pass  # category functionality is not yet implemented

        query += ";"

        rows = await conn.execute_query_dict(query, query_params)

    products = process_product_rows(rows)

    return products


async def get_products(user_id: str, filters: Optional[dict[str, str]] = None):
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            join website w on p.domain = w.domain
            where up.user_id = $1"""
        query_params = [user_id]

        if filters:
            for key, value in filters.items():
                if key == "list":
                    if value == "likes":
                        query += " and liked = TRUE"
                elif key == "brand":
                    if value:
                        brand_placeholders = ", ".join(
                            f"${i+len(query_params)+1}" for i in range(len(value))
                        )
                        query += f" and brand = ANY(ARRAY[{brand_placeholders}])"
                        query_params.extend(value)
                elif key == "website":
                    if value:
                        website_placeholders = ", ".join(
                            f"${i+len(query_params)+1}" for i in range(len(value))
                        )
                        query += f" and company_id = ANY(ARRAY[{website_placeholders}])"
                        query_params.extend(value)
                elif key == "category":
                    pass  # category functionality is not yet implemented

        query += ";"

        rows = await conn.execute_query_dict(query, query_params)

    products = process_product_rows(rows)

    return products


async def get_product(user_id: str, product_url: str) -> dict:
    async with get_db_connection() as conn:
        query = """
            select * from user_product up
            join product p on up.product_url = p.url
            join product_image pi on p.url = pi.product_url
            join website w on p.domain = w.domain
            where up.user_id = $1 and up.product_url = $2;
        """
        rows = await conn.execute_query_dict(query, [user_id, product_url])

    products = process_product_rows(rows)
    return products[0] if products else None


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
        result = await conn.execute_query_dict(
            query,
            [
                product.url,
                product.domain,
                product.brand,
                product.name,
                product.price,
                product.currency,
            ],
        )

        # Insert images
        query = """
        insert into product_image (product_url, image_url)
        values ($1, $2) returning *;
        """
        for image in product.images:
            await conn.execute_query_dict(query, [product.url, image])

        # 3. add the user_product relationship
        check_query = (
            """select * from user_product where user_id = $1 and product_url = $2;"""
        )
        check_result = await conn.execute_query_dict(
            check_query, [user_id, product.url]
        )
        if check_result:
            return True

        query = """
        insert into user_product (user_id, product_url)
        values ($1, $2);
        """
        await conn.execute_query_dict(query, [user_id, product.url])

    return True


async def add_product_image(product_image: ProductImage) -> dict:
    try:
        async with get_db_connection() as conn:
            query = """insert into product_image (product_url, image_url) values ($1, $2);"""
            result = await conn.execute_query_dict(
                query, [product_image.product_url, product_image.image_url]
            )

        return {"success": True, "message": "Image added successfully"}
    except Exception as e:
        # todo: more specific error handling
        return {"success": False, "message": "Image already exists"}


async def add_product_images(product_images: ProductImages) -> dict:
    async with get_db_connection() as conn:
        query = (
            """insert into product_image (product_url, image_url) values ($1, $2);"""
        )
        for image_url in product_images.image_urls:
            try:
                await conn.execute_query_dict(
                    query, [product_images.product_url, image_url]
                )
            except Exception as e:
                print(e)  # just a duplicate in the list, ignore it

    return {"success": True, "message": "Images added successfully"}


async def delete_product_images(product_image: ProductImages) -> dict:
    async with get_db_connection() as conn:
        query = (
            """delete from product_image where product_url = $1 and image_url = $2;"""
        )
        for image_url in product_image.image_urls:
            await conn.execute_query_dict(query, [product_image.product_url, image_url])

    return {"success": True, "message": "Images deleted successfully"}


async def dislike_products(user_id: str, products: LikeProducts) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = FALSE where user_id = $1 and product_url = $2;
        """
        for product_url in products.product_urls:
            await conn.execute_query_dict(query, [user_id, product_url])

    return products.product_urls


async def like_products(user_id: str, products: LikeProducts) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = TRUE where user_id = $1 and product_url = $2;
        """
        for product_url in products.product_urls:
            await conn.execute_query_dict(query, [user_id, product_url])

    return products.product_urls


### BRAND INFO ###


async def get_brands(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            SELECT DISTINCT brand FROM product 
            join user_product up on up.product_url = product.url where up.user_id = $1;
        """
        brands = await conn.execute_query_dict(query, [user_id])

    return brands


### LISTS ###
async def get_p_lists(user_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
            select id from p_list where user_id = $1;
        """
        lists = await conn.execute_query_dict(query, [user_id])

    return lists


async def create_p_list(user_id: str, p_list: ListProducts) -> str:
    async with get_db_connection() as conn:
        query = """
        insert into p_list (id, user_id) values ($1, $2);
        """
        await conn.execute_query_dict(query, [p_list.id, user_id])

        if p_list.product_urls:
            query = """
            insert into list_product (list_id, product_url) values ($1, $2);
            """
            for product_url in p_list.product_urls:
                await conn.execute_query_dict(query, [p_list.id, product_url])

    return p_list.id


async def delete_p_list(user_id: str, p_list: ListBase) -> str:
    async with get_db_connection() as conn:
        query = """
        delete from p_list where id = $1 and user_id = $2;
        """
        await conn.execute_query_dict(query, [p_list.id, user_id])

    return p_list.id


async def add_products_to_p_list(user_id: str, list_products: ListProducts) -> str:
    # user id might be needed in the future
    async with get_db_connection() as conn:
        query = """
        insert into list_product (list_id, product_url) values ($1, $2);
        """
        for product_url in list_products.product_urls:
            try:
                await conn.execute_query_dict(query, [list_products.id, product_url])
            except Exception as e:
                print(e)  # just a duplicate in the list, ignore it

    return True


async def delete_products_from_p_list(user_id: str, list_products: ListProducts) -> str:
    # user id might be needed in the future
    async with get_db_connection() as conn:
        query = """
        delete from list_product where list_id = $1 and product_url = $2;
        """
        for product_url in list_products.product_urls:
            await conn.execute_query_dict(query, [list_products.id, product_url])
    return True


async def delete_products_from_history(
    user_id: str, list_products: ListProducts
) -> str:
    # user id might be needed in the future
    async with get_db_connection() as conn:
        query = """
        delete from user_product where user_id = $1 and product_url = $2;
        """
        for product_url in list_products.product_urls:
            await conn.execute_query_dict(query, [user_id, product_url])
    return True


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


### HELPER FUNCTIONS ###
def process_product_rows(rows: list[dict]) -> list[dict]:
    products_dict = {}
    for row in rows:
        product_url = row["product_url"]
        if product_url not in products_dict:
            product = {
                "url": product_url,
                "company": row["company_id"],
                "domain": row["domain"],
                "brand": row["brand"],
                "name": row["name"],
                "price": row["price"],
                "currency": row["currency"],
                "liked": row["liked"],
                "images": [],
            }
            products_dict[product_url] = product

        # Add the image URL to the product's image list
        products_dict[product_url]["images"].append(row["image_url"])

    return list(products_dict.values())
