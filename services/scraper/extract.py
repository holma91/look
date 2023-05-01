import asyncio
import os

from dotenv import load_dotenv
import aiohttp

from Scraper import Scraper
from models import Gucci

load_dotenv()

async def main():
    connector = aiohttp.TCPConnector(limit=20)
    proxy_url = os.environ.get('proxy_url')
    premium_proxy_url = os.environ.get('premium_proxy_url')
    async with aiohttp.ClientSession(connector=connector) as session:
        scraper = Scraper(session=session, proxy_url=proxy_url, premium_proxy_url=premium_proxy_url)
        model = Gucci(country='us', scraper=scraper)
        await model.start()

if __name__ == '__main__':
    asyncio.run(main())