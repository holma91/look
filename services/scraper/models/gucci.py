import json
import re
from pydantic import BaseModel
from Crawler import Crawler
from Scraper import Scraper
from Database import Database

from Types import Primitive_Item, Item


seeds = {
    # "women-handbags": "women",
    "women-accessories-lifestyle-bags-and-luggage": "women",
    # "women-readytowear": "women",
    # "women-shoes": "Shoes",
    # "women-accessories-wallets": "Accessories",
    # "women-accessories-belts": "Accessories",
    # "jewelry-watches-watches-women": "Watches",
    # "men-bags": "Bags",
    # "men-bags-trolleys": "Bags",
    # "men-readytowear": "men",
    # "men-shoes": "Shoes",
    # "men-accessories-wallets": "Accessories",
    # "jewelry-watches-watches-men": "Watches",
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

    def __init__(self, country: str, scraper: Scraper, database: Database):
        self.country = country
        self.scraper = scraper
        self.database = database
        self.base_url = urls[country]
        
    def start(self):
        primitive_items_by_seed = self.get_primitive_items()
        self.process_items(primitive_items_by_seed)

    def get_primitive_items(self) -> dict[str, list[Primitive_Item]]:
        primitive_items_by_seed = {}
        for seed, audience in seeds.items():
            api_url = f"{self.base_url}/c/productgrid?categoryCode={seed}&show=Page"
            primitive_items = []
            # for page in range(self.max_page):
            for page in range(1):
                page_url = f"{api_url}&page={page}"
                res = self.scraper.get_json(page_url, headers=headers, model_id=self.domain)
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
                    if (len(primitive_items) == 5):
                        break
                # print("finished scraping page", page, ", primitive_items", primitive_items)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
    
    def process_items(self, primitive_items_by_seed: dict[str, list[Primitive_Item]]):
        items = []
        for seed, primitive_items in primitive_items_by_seed.items():
            for primitive_item in primitive_items:
              item_url = primitive_item.item_url
              item_id = primitive_item.item_id
              audience = primitive_item.audience
              doc = self.scraper.get_html(item_url, headers=headers, model_id=self.domain)
              if doc is None:
                  continue
              
              item = self.process_doc(doc, item_url, item_id, audience)
              items.append(item.json())
              self.database.insert_item(item)
        # print(json.dumps(items, indent=2))
        # print(items)
    
    def process_doc(self, doc: str, item_url: str, item_id: str, audience: str):
        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)
        
        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = product_data["image"]

        sizes = self.get_sizes(product_data)
        categories = self.get_categories(breadcrumb_data)
        audience = self.get_audience(audience, categories)
        colors = self.get_colors(doc)

        abstract_item_pk = f"{self.brand}:{item_id}".lower()
        item_pk = f"{self.domain}:{self.brand}:{item_id}".lower()

        currency = product_data["offers"][0]["priceCurrency"]
        price = product_data["offers"][0]["price"]

        item = Item(item_id=item_id, item_url=item_url, audience=audience, brand=brand.lower(), domain=self.domain, country=self.country, name=name, description=description, images=images, sizes=sizes, colors=colors, currency=currency, price=price, categories=categories)

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