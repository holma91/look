from app.db import get_db_connection

async def get_all() -> list:
    async with get_db_connection() as conn:
        query = """
        SELECT * FROM company;
        """
        companies = await conn.execute_query_dict(query)
    
    return companies