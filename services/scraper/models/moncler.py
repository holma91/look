import json
import time
from lxml import html
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field, validator

from Scraper import Scraper
from Types import PrimitiveItem, Item, CustomBaseModel
from BaseParser import BaseParser
from BaseTransformer import BaseTransformer



class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="moncler", domain="moncler.com")

    async def start(self):
        start_time = time.time()
        primitive_items_by_seed = await self.get_primitive_items()
        print(f'{self.brand} - get_primitive_items time: %.2f seconds.' % (time.time() - start_time))

        # start_time = time.time()
        # await self.process_primitive_items(primitive_items_by_seed)
        # print(f'{self.brand} - process_items time: %.2f seconds.' % (time.time() - start_time))

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        base_url = 'https://www.moncler.com/on/demandware.store/Sites-MonclerUS-Site/en_US/SearchApi-Search'
        for seed, audience in self.seeds.items():
            page_size = 100
            api_url = f"{base_url}?cgid={seed}&sz={page_size}"
            primitive_items = []
            for page in range(self.scraper.max_page):
                page_url = f"{api_url}&start={page * page_size}"
                try:
                    res = await self.scraper.get_json(page_url, headers=self.headers, model_id=self.domain)
                except Exception:
                    break

                items = res["data"]["products"]
                if not items: # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['route']}" # productUrl if we wanna include country code
                    primitive_item = PrimitiveItem(item_url=item_url, audience=audience)
                    primitive_items.append(primitive_item)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
        
    async def get_extracted_item(self, doc: str, primitive_item: PrimitiveItem):
        # interesting thing, everything exists in the first api call...
        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)

        colors = list(set(doc.xpath('//span[@class="color-material-name"]/text()')))
        extra_description = doc.xpath('//*[@id="product-details"]')
        formatted_extra_description = html.tostring(extra_description[0], pretty_print=True, encoding='unicode')

        item = ParsedItem(
            item_url=primitive_item.item_url,
            audience=primitive_item.audience,
            domain=self.domain,
            country=self.country,
            product_data=ProductData(**product_data), 
            breadcrumb_data=BreadcrumbData(**breadcrumb_data), 
            colors=colors,
            extra_description=formatted_extra_description
        )

        return item