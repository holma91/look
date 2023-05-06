import json
import logging
from lxml import html
from typing import Optional

from pydantic import BaseModel, HttpUrl, ValidationError, Field, validator
from Scraper import Scraper
from Types import PrimitiveItem, Item, CustomBaseModel
from BaseParser import BaseParser
from BaseTransformer import BaseTransformer

# TYPECHECKING FOR BREADCRUMBS
class ListItem(CustomBaseModel):
    type: str = Field(alias="@type")
    name: str
    position: str
    item: Optional[HttpUrl]

class BreadcrumbData(CustomBaseModel):
    context: list[str] = Field(alias="@context")
    type: str = Field(alias="@type")
    itemListElement: list[ListItem]

# TYPECHECKING FOR PRODUCT
class Brand(CustomBaseModel):
    type: str = Field(alias='@type')
    name: str
    url: HttpUrl

class Offer(CustomBaseModel):
    type: str = Field(alias='@type')
    price: str
    priceCurrency: str
    url: HttpUrl
    availability: HttpUrl
    itemCondition: HttpUrl

class ProductData(CustomBaseModel):
    context: list[str] = Field(alias='@context')
    type: str = Field(alias='@type')
    name: Optional[str]
    description: str
    color: str
    sku: str
    brand: Brand
    offers: Offer
    image: list[HttpUrl]

    @validator("image", pre=True)
    def handle_single_image(cls, value):
        if isinstance(value, str):
            return [value]
        return value

# TYPECHECKING FOR SIZES
class StockLevelStatus(BaseModel):
    code: str
    type: str

class Stock(BaseModel):
    stockLevelStatus: StockLevelStatus
    stockLevel: Optional[int]
    stockThreshold: Optional[int]
    effectiveStock: Optional[int]
    preorderable: Optional[bool]
    backorderable: Optional[bool]
    inTransit: Optional[int]
    openOrders: Optional[int]

class SizeData(BaseModel):
    variantCode: str
    code: str
    stock: Stock
    order: int

# THE TYPE THAT'S SAVED TO S3
class ParsedItem(BaseModel):
    item_url: str
    audience: str
    domain: str
    country: str
    product_data: ProductData
    breadcrumb_data: BreadcrumbData
    size_data: list[SizeData]
    extra_description: str

# when, the parser fails, we know that page structure has changed
class LoroPiana(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="loro_piana", domain="loropiana.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        for seed, audience in self.seeds.items():
            api_url = f"{self.base_url}{seed}"
            primitive_items = []
            # for page in range(1):
            for page in range(self.scraper.max_page):
                page_url = f"{api_url}?page={page}"
                try:
                    res = await self.scraper.get_json(page_url, headers=self.headers, model_id=self.domain)
                except Exception:
                    break

                items = res["results"]
                if not items: # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['url']}"
                    primitive_item = PrimitiveItem(item_url=item_url, audience=audience)
                    primitive_items.append(primitive_item)
                    # if (len(primitive_items) >= 10):
                        # break
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed

    async def get_extracted_item(self, primitive_item: PrimitiveItem, headers: dict) -> ParsedItem:
        # by returning None, the BaseParser will see this as a failed job and will retry it
        async def create_extracted_item(doc: str, primitive_item: PrimitiveItem):
            product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
            breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)

            sku = product_data['sku']
            article_code, color_code = sku.rsplit("_", 1)
            product_url = f"{self.base_url}/api/pdp/product-variants?articleCode={article_code}&colorCode={color_code}"
            article = await self.scraper.get_json(product_url, headers=headers, model_id=self.domain)
            size_data = article[0]['sizes']

            extra_description = doc.xpath('//*[@id="productDetail"]')
            formatted_extra_description = html.tostring(extra_description[0], pretty_print=True, encoding='unicode')

            item = ParsedItem(
                item_url=primitive_item.item_url,
                audience=primitive_item.audience,
                domain=self.domain,
                country=self.country,
                product_data=ProductData(**product_data), 
                breadcrumb_data=BreadcrumbData(**breadcrumb_data), 
                size_data=[SizeData(**size) for size in size_data],
                extra_description=formatted_extra_description
            )

            return item
        
        try:
            doc = await self.scraper.get_html(primitive_item.item_url, headers=headers, model_id=self.domain)
            item = await create_extracted_item(doc, primitive_item)
            return item
        except ValidationError as e:
            logging.error(f"validation error for url {primitive_item.item_url}: {e}")
            print('validation error:', e)
            return None
        except Exception as e:
            print('exception', e)
            return None
        

class Transformer(BaseTransformer):
    def __init__(self, db_url: str, model_id: str):
        super().__init__(db_url=db_url, model_id=model_id)
    
    def transform(self, parsed_items: list[ParsedItem]) -> list[Item]:
        def get_sizes(size_data: list[SizeData]) -> dict:
            sizes = {}
            for size_info in size_data:
                size = size_info.code
                in_stock = size_info.stock.stockLevelStatus.code == 'inStock'
                sizes[size] = in_stock
            return sizes

        def get_categories(breadcrumbs: list[ListItem]) -> list:
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb.name
                rank = breadcrumb.position
                categories.append({"name": name, "rank": rank})
            return categories
        
        transformed_items = []
        for parsed_item in parsed_items:
            product_data = parsed_item.product_data
            breadcrumb_data = parsed_item.breadcrumb_data
            size_data = parsed_item.size_data

            sizes = get_sizes(size_data)
            categories = get_categories(breadcrumb_data.itemListElement)

            item = Item(
                item_url=parsed_item.item_url,
                audience=parsed_item.audience,
                item_id=product_data.sku,
                brand=product_data.brand.name.strip().lower().replace(" ", "_"), 
                domain=parsed_item.domain,
                country=parsed_item.country,
                name=product_data.name or product_data.sku, # product_data.sku as backup
                description=product_data.description,
                images=product_data.image,
                sizes=sizes,
                colors=[product_data.color],
                currency=product_data.offers.priceCurrency,
                price=product_data.offers.price,
                categories=categories
            )

            transformed_items.append(item)
        
        return transformed_items