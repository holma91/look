import json
import logging
import time
from lxml import html
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field, validator, ValidationError

from Scraper import Scraper
from Types import PrimitiveItem, Item, CustomBaseModel
from BaseParser import BaseParser
from BaseTransformer import BaseTransformer

# type: API-API

# TYPECHECKING FOR BREADCRUMBS
class BreadcrumbItem(BaseModel):
    htmlValue: str
    categoryId: str
    url: str

# TYPECHECKING FOR PRODUCT    
class SizeData(BaseModel):
    id: str
    displayValue: str
    value: str
    ATS: int
    selectable: Optional[bool]

class ApiData(BaseModel):
    item_master_id: str
    item_id: str
    name: str
    price: str
    currency: str
    color: str
    long_description: str
    short_description: str
    description: str
    composition: str
    care: str
    size_and_fit: str
    madeIn: str
    size_data: list[SizeData]
    breadcrumbs: list[BreadcrumbItem]

class ParsedItem(BaseModel):
    item_url: str
    audience: str
    domain: str
    country: str

    api_data: ApiData

class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="moncler", domain="moncler.com")

    async def start(self):
        start_time = time.time()
        primitive_items_by_seed = await self.get_primitive_items()
        print(primitive_items_by_seed)
        print(f'{self.brand} - get_primitive_items time: %.2f seconds.' % (time.time() - start_time))

        # start_time = time.time()
        # await self.process_primitive_items(primitive_items_by_seed)
        # print(f'{self.brand} - process_items time: %.2f seconds.' % (time.time() - start_time))

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
                if not items: # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['route']}" # productUrl if we wanna include country code
                    item_api_url = f"{product_api_url}?pid={item['id']}"
                    primitive_item = PrimitiveItem(item_url=item_url, item_api_url=item_api_url, audience=audience)
                    primitive_items.append(primitive_item)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
    
    async def process_item(self, primitive_item: PrimitiveItem, headers: dict):
        """If this method returns None, the job will be considered failed and retried."""
        try:
            product = await self.scraper.get_json(primitive_item.item_api_url, headers=headers, model_id=self.domain)
            item = await self.get_extracted_item(product, primitive_item)
            return item
        except ValidationError as e:
            logging.error(f"validation error for url {primitive_item.item_url}: {e}")
            print('validation error:', e)
            return None
        except Exception as e:
            print("exception", e)
            return None
        
    async def get_extracted_item(self, doc: str, primitive_item: PrimitiveItem):
        # interesting thing, everything exists in the first api call...
        # by making another call here, we can get materials, care and breadcrumbs, size and fit
        api_data = doc
        color_data = {}
        sizes = {}
        for attribute in api_data["variationAttributes"]:
            if attribute["id"] == "color":
                color_data = attribute
            elif attribute["id"] == "size":
                sizes = attribute

        composition = ""
        care = ""
        for attribute in api_data["attributes"]:
            if attribute["ID"] == "compositionAndCare":
                for inner_attribute in attribute["attributes"]:
                    if inner_attribute["label"] == "Composition":
                        composition = inner_attribute["values"][0]
                    elif inner_attribute["label"] == "Care":
                        care = inner_attribute["values"][0]
                

        ApiData(
            item_master_id=api_data["masterId"],
            item_id=api_data["id"],
            name=api_data["productName"],
            price=api_data["price"]["sales"]["value"],
            currency=api_data["price"]["sales"]["currency"],
            color=api_data["variationAttributes"],
            description=api_data["description"],
            long_description=api_data["longDescription"],
            short_description=api_data["shortDescription"],
            composition=composition,
            care=care,
            

            size_data=[SizeData(**size) for size in sizes["values"]],
            breadcrumbs=[BreadcrumbItem(**breadcrumb) for breadcrumb in api_data["breadcrumbs"]]
        )



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