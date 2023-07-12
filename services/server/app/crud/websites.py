from tortoise import Tortoise
from app.db import get_db_connection

async def get_all() -> list:
    # check if user_id exists
    async with get_db_connection() as conn:
        query = """
        select * from website
        """
        websites = await conn.execute_query_dict(query)
    
    return websites

async def get_by_company(company_id: str) -> list:
    async with get_db_connection() as conn:
        query = """
        select * from website where company_id = $1;
        """
        websites = await conn.execute_query_dict(query, [company_id])
    
    return websites

async def get_companies() -> list:
    async with get_db_connection() as conn:
        query = """
        SELECT * FROM company;
        """
        companies = await conn.execute_query_dict(query)
    
    return companies