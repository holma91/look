import json
import logging
import time
from lxml import html

from Scraper import Scraper
from Types import PrimitiveItem, Item, Size, Category, Color
from BaseParser import BaseParser

class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper, scraping_type: str):
        super().__init__(country, scraper, scraping_type, brand="moncler", domain="moncler.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        base_api_url = 'https://www.moncler.com/on/demandware.store/Sites-MonclerUS-Site/en_US'
        for seed, audience in self.seeds.items():
            page_size = 100
            search_api_url = f"{base_api_url}/SearchApi-Search?cgid={seed}&sz={page_size}"
            product_api_url = f"{base_api_url}/ProductApi-Product"
            primitive_items = []
            for page in range(self.scraper.max_page):
                page_url = f"{search_api_url}&start={page * page_size}"
                try:
                    res = await self.scraper.get_json(page_url, headers=self.headers, model_id=self.domain)
                except Exception:
                    break

                items = res["data"]["products"]
                if not items:
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['route']}" # productUrl if we wanna include country code
                    item_api_url = f"{product_api_url}?pid={item['id']}"
                    primitive_item = PrimitiveItem(item_url=item_url, item_api_url=item_api_url, audience=audience)
                    primitive_items.append(primitive_item)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
        
    async def get_extracted_item(self, src: str, primitive_item: PrimitiveItem):
        def get_sizes(size_data: list) -> list[Size]:
            sizes = []
            for size_info in size_data:
                size = size_info['displayValue']
                in_stock = size_info.get('ATS', 0) > 0 and size_info.get('selectable', False)
                sizes.append(Size(size=size, in_stock=in_stock))
            return sizes

        def get_categories(breadcrumbs: list) -> list[Category]:
            categories = []
            for i, breadcrumb in enumerate(breadcrumbs):
                name = breadcrumb['htmlValue']
                categories.append(Category(name=name, rank=i+1))
            return categories
        
        api_data = src
        color_data = {}
        size_data = {}
        for attribute in api_data["variationAttributes"]:
            if attribute["id"] == "color":
                color_data = attribute
            elif attribute["id"] == "size":
                size_data = attribute
                

        sizes = get_sizes(size_data["values"])
        categories = get_categories(src["breadcrumbs"])
        
        item = Item(
            item_url=primitive_item.item_url,
            item_api_url=primitive_item.item_api_url,
            audience=primitive_item.audience,
            domain=self.domain,
            country=self.country,
            item_id=src["id"],
            brand=self.brand,
            name=src["productName"],
            description=src["description"],
            images=src['imgs']['urls'],
            currency=src["price"]["sales"]["currency"],
            price=src["price"]["sales"]["value"],
            sizes=sizes,
            categories=categories,
            colors=[Color(name=color_data["displayValue"])],
        )

        return item