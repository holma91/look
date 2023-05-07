import asyncio
import os
import logging

from dotenv import load_dotenv
import aiohttp

from Scraper import Scraper
import models.gucci
import models.loro_piana

load_dotenv()

async def main():
    logging.basicConfig(filename='./logs/scraper.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    proxy_url = os.environ.get('brightdata_datacenter_us_proxy')
    proxy_username = os.environ.get('brightdata_datacenter_us_proxy_username')
    proxy_password = os.environ.get('brightdata_datacenter_us_proxy_password')
    proxy_auth = aiohttp.BasicAuth(proxy_username, proxy_password)
    
    connector = aiohttp.TCPConnector(limit=20)
    async with aiohttp.ClientSession(connector=connector) as session:
        scraper = Scraper(session=session, proxy_url=proxy_url, proxy_auth=proxy_auth)
        gucci = models.gucci.Parser(country='us', scraper=scraper)
        loro_piana = models.loro_piana.Parser(country='us', scraper=scraper)
        await gucci.start()
        # await loro_piana.start()
        # await moncler.start()

if __name__ == '__main__':
    asyncio.run(main())