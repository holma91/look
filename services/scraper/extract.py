import asyncio
from sqlalchemy import create_engine, text

from Scraper import Scraper
from Database import Database
from models import Gucci
starters = ['gucci', 'tomford', 'moncler', 'loropiana','burberry']

async def main():
    scraper = Scraper()
    model = Gucci(country='us', scraper=scraper)
    await model.start()

if __name__ == '__main__':
    asyncio.run(main())