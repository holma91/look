from tortoise import Tortoise
from app.db import get_db_connection

async def get_all(user_id: str) -> list:
    # check if user_id exists
    async with get_db_connection() as conn:
        query = """
        SELECT 
            website.*,
            CASE WHEN user_website.user_id IS NULL THEN FALSE ELSE TRUE END as is_favorite
        FROM website 
        LEFT JOIN user_website 
            ON user_website.website_id = website.domain
            AND user_website.user_id = $1
        """
        websites = await conn.execute_query_dict(query, [user_id])
    
    return websites