@router.post("/{user_id}/likes", status_code=201, response_model=POSTResponse)
async def add_like(user_id: str, product: LikeProduct) -> POSTResponse:
    product = await crud.add_like(user_id, product.product_url)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return SUCCESSFUL_POST_RESPONSE

@router.delete("/{user_id}/likes", status_code=204)
async def delete_like(user_id: str, product: LikeProduct):
    result = await crud.un_like(user_id, product.product_url)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")
    

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