import json
from pydantic import BaseModel
from Crawler import Crawler
from Scraper import Scraper
from Database import Database
from Basic import Basic

class Primitive_Item(BaseModel):
    item_id: str
    item_url: str

class Item(Primitive_Item):
    brand: str
    name: str
    description: str
    images: list
    sizes: list
    colors: list
    currency: str
    price: str
    in_stock: bool
    breadcrumb: list  


seeds = {
    "women-handbags": "Handbags",
    # "women-accessories-lifestyle-bags-and-luggage": "Accessories",
    # "women-readytowear": "Ready To Wear",
    # "women-shoes": "Shoes",
    # "women-accessories-wallets": "Accessories",
    # "women-accessories-belts": "Accessories",
    # "jewelry-watches-watches-women": "Watches",
    # "men-bags": "Bags",
    # "men-bags-trolleys": "Bags",
    # "men-readytowear": "Ready To Wear",
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

class Hucci(Basic):
    model_id = "gucci"

    def __init__(self, country: str, scraper: Scraper, database: Database):
        self.country = country
        self.scraper = scraper
        self.database = database
        self.base_url = urls[country]
        
    def start(self):
        primitive_items_by_seed = self.get_primitive_items()
        print("pi:",primitive_items_by_seed)
        self.process_items(primitive_items_by_seed)

    def get_primitive_items(self) -> dict[str, list[Primitive_Item]]:
        primitive_items_by_seed = {}
        for seed, _ in seeds.items():
            # print("scraping with seed", seed)
            api_url = f"{self.base_url}/c/productgrid?categoryCode={seed}&show=Page"
            primitive_items = []
            # for page in range(self.max_page):
            for page in range(1):
                page_url = f"{api_url}&page={page}"
                res = self.scraper.get_json(page_url, headers=headers, model_id=self.model_id)
                if not res:
                    break
                items = res["products"]["items"]
                if not items:
                    # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['productLink']}"
                    # it's possible to do a gender play in the seeds and add to primitive_item
                    primitive_item = Primitive_Item(item_id=item["productCode"], item_url=item_url)
                    primitive_items.append(primitive_item)
                    if (len(primitive_items) == 3):
                        break
                # print("finished scraping page", page, ", primitive_items", primitive_items)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
    
    def process_items(self, primitive_items_by_seed: dict[str, list[Primitive_Item]]):
        for seed, primitive_items in primitive_items_by_seed.items():
            for primitive_item in primitive_items:
              print("seed", seed, "primitive_item", primitive_item)
              item_url = primitive_item.item_url
              item_id = primitive_item.item_id
              doc = self.scraper.get_html(item_url, headers=headers, model_id=self.model_id)
              if doc is None:
                  continue
              
              item = self.process_doc(doc, item_url, item_id)
              print(item.json(indent=2))
              # self.database.add(item)
    
    def process_doc(self, doc, item_url, item_id):
        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)
        
        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = product_data["image"]
        sizes = doc.xpath('//select[@name="size"]/option[@data-available="true"]/text()')
        sizes = list(set([s.strip() for s in sizes]))
        colors = list(set(doc.xpath('//span[@class="color-material-name"]/text()')))
        currency = product_data["offers"][0]["priceCurrency"]
        price = product_data["offers"][0]["price"]
        in_stock = product_data["offers"][0]["availability"] == 'InStock'
        breadcrumb = [b["item"]["name"] for b in breadcrumb_data["itemListElement"]]

        item = Item(item_id=item_id, item_url=item_url, brand=brand, name=name, description=description, images=images, sizes=sizes, colors=colors, currency=currency, price=price, in_stock=in_stock, breadcrumb=breadcrumb)

        return item
          
    
