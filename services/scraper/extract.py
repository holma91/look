import asyncio
import os

from dotenv import load_dotenv
import aiohttp

from Scraper import Scraper
from models import Gucci

load_dotenv()

async def main():
    proxy_url = os.environ.get('brightdata_datacenter_proxy')
    proxy_username = os.environ.get('brightdata_datacenter_proxy_username')
    proxy_password = os.environ.get('brightdata_datacenter_proxy_password')
    proxy_auth = aiohttp.BasicAuth(proxy_username, proxy_password)
    
    connector = aiohttp.TCPConnector(limit=20)
    async with aiohttp.ClientSession(connector=connector) as session:
        scraper = Scraper(session=session, proxy_url=proxy_url, proxy_auth=proxy_auth)
        model = Gucci(country='us', scraper=scraper)
        await model.start()

if __name__ == '__main__':
    asyncio.run(main())