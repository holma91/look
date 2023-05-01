import json
import re
import time
import asyncio

from datetime import datetime
from pydantic import BaseModel
from Scraper import Scraper

from Types import Primitive_Item, Item


seeds = {
    "women-handbags": "women",
    "women-accessories-lifestyle-bags-and-luggage": "women",
    "women-readytowear": "women",
    # "women-shoes": "women",
    # "women-accessories-wallets": "women",
    # "women-accessories-belts": "women",
    # "jewelry-watches-watches-women": "women",
    # "men-bags": "men",
    # "men-bags-trolleys": "men",
    # "men-readytowear": "men",
    # "men-shoes": "men",
    # "men-accessories-wallets": "men",
    # "jewelry-watches-watches-men": "men",
}

headers = {
    'authority': 'www.gucci.com',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}

urls = {
    'us': 'https://www.gucci.com/us/en',
    'uk': 'https://www.gucci.com/uk/en_gb',
    'se': 'https://www.gucci.com/se/en_gb',
}

# type: API

class Gucci:
    brand = "gucci"
    domain = "gucci.com"

    def __init__(self, country: str, scraper: Scraper):
        self.country = country
        self.scraper = scraper
        self.base_url = urls[country]
        
    async def start(self):
        start_time = time.time()
        primitive_items_by_seed = await self.get_primitive_items()
        print(f'get_primitive_items time: %.2f seconds.' % (time.time() - start_time))

        start_time = time.time()
        await self.process_items(primitive_items_by_seed)
        print(f'process_items time: %.2f seconds.' % (time.time() - start_time))

    async def get_primitive_items(self) -> dict[str, list[Primitive_Item]]:
        primitive_items_by_seed = {}
        for seed, audience in seeds.items():
            api_url = f"{self.base_url}/c/productgrid?categoryCode={seed}&show=Page"
            primitive_items = []
            for page in range(1):
            # for page in range(self.scraper.max_page):
                page_url = f"{api_url}&page={page}"
                # res = self.scraper.get_json(page_url, headers=headers, model_id=self.domain)
                res = await self.scraper.get_json_async(page_url, headers=headers, model_id=self.domain)
                if not res:
                    break
                items = res["products"]["items"]
                if not items:
                    # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['productLink']}"
                    primitive_item = Primitive_Item(item_id=item["productCode"], item_url=item_url, audience=audience)
                    primitive_items.append(primitive_item)
                    # if (len(primitive_items) >= 5):
                        # break
                # print("finished scraping page", page, ", primitive_items", primitive_items)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed

    async def process_items(self, primitive_items_by_seed: dict[str, list[Primitive_Item]]):
        today = datetime.today()
        date_str = today.strftime('%Y-%m-%d')
        output_file = f'./results/{self.brand}_{date_str}.jsonl'

        tasks = []
        for seed, primitive_items in primitive_items_by_seed.items():
            for primitive_item in primitive_items:
                task = asyncio.create_task(self.process_item(primitive_item, headers))
                tasks.append(task)

        items = await asyncio.gather(*tasks)

        with open(output_file, 'w') as file:
            for item in items:
                if item is not None:
                    file.write(item.json() + '\n')
        
    async def process_item(self, primitive_item, headers):
        item_url = primitive_item.item_url
        item_id = primitive_item.item_id
        audience = primitive_item.audience
        doc = await self.scraper.get_html_async(item_url, headers=headers, model_id=self.domain)
        if doc is not None:
            return self.process_doc(doc, item_url, item_id, audience)
        return None
               
    def process_doc(self, doc: str, item_url: str, item_id: str, audience: str):
        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)
        
        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = product_data["image"]

        sizes = self.get_sizes(product_data)
        categories = self.get_categories(breadcrumb_data)
        colors = self.get_colors(doc)

        breadcrumbs = breadcrumb_data["itemListElement"]

        currency = product_data["offers"][0]["priceCurrency"]
        price = product_data["offers"][0]["price"]

        item = Item(item_id=item_id, item_url=item_url,audience=audience, brand=brand.lower(), domain=self.domain, country=self.country, name=name, description=description, images=images, sizes=sizes, colors=colors, currency=currency, price=price, breadcrumbs=breadcrumbs)

        return item
    
    def get_sizes(self, product_data: dict) -> list[str]:
        # sizes = doc.xpath('//select[@name="size"]/option[@data-available="true"]/text()')
        # sizes = list(set([s.strip() for s in sizes]))
        # some sites have size data in schema

        sizes = {}
        for offer in product_data["offers"]:
            size = offer["sku"].split("_")[-1]
            in_stock = offer["availability"] == 'InStock'
            sizes[size] = in_stock
        
        return sizes
    
    def get_categories(self, breadcrumb_data: dict) -> list[str]:
        breadcrumbs = breadcrumb_data["itemListElement"]
        categories = []
        for breadcrumb in breadcrumbs:
            name = breadcrumb["item"]["name"]
            rank = breadcrumb["position"]
            categories.append({"name": name, "rank": rank})
        return categories
    
    def get_audience(self, audience: str, categories: list[dict]) -> str:
        men = False
        women = False
        for category in categories:
            lower = category["name"].lower()
            if re.search(r'\bmen\b', lower):
                men = True
            if re.search(r'\bwomen\b', lower):
                women = True

        sex = audience
        if men and women:
            sex = "unisex"
        elif men:
            sex = "men"
        elif women:
            sex = "women"

        return sex
    
    def get_colors(self, doc: str) -> list[str]:
        # split text by word
        # compare every word with a list of colors
        colors = list(set(doc.xpath('//span[@class="color-material-name"]/text()')))
        return colors