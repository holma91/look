import json
from lxml import html
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field, validator

from Scraper import Scraper
from Types import PrimitiveItem, Item, CustomBaseModel
from BaseParser import BaseParser
from BaseTransformer import BaseTransformer

# TYPECHECKING FOR BREADCRUMBS
class BreadcrumbItem(CustomBaseModel):
    id: str = Field(alias="@id")
    name: str

class ListItem(CustomBaseModel):
    type: str = Field(alias="@type")
    position: int
    item: BreadcrumbItem

class BreadcrumbData(CustomBaseModel):
    context: str = Field(alias="@context")
    type: str = Field(alias="@type")
    itemListElement: list[ListItem]

# TYPECHECKING FOR PRODUCT
class Brand(CustomBaseModel):
    type: str = Field(alias="@type")
    name: str

class Offer(CustomBaseModel):
    type: str = Field(alias="@type")
    sku: str
    price: str
    priceCurrency: str
    seller: str
    url: HttpUrl
    availability: str

class ProductData(CustomBaseModel):
    context: str = Field(alias="@context")
    type: str = Field(alias="@type")
    sku: str
    url: HttpUrl
    itemCondition: str
    name: Optional[str]
    description: str
    productID: str
    brand: Brand
    image: list[HttpUrl]
    offers: list[Offer]

    @validator("image", pre=True)
    def handle_single_image(cls, value):
        if isinstance(value, str):
            return [value]
        return value

class ParsedItem(BaseModel):
    item_url: str
    audience: str
    domain: str
    country: str

    product_data: ProductData
    breadcrumb_data: BreadcrumbData
    colors: list[str]
    extra_description: str

class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="gucci", domain="gucci.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        for seed, audience in self.seeds.items():
            api_url = f"{self.base_url}/c/productgrid?categoryCode={seed}&show=Page"
            primitive_items = []
            for page in range(self.scraper.max_page):
                page_url = f"{api_url}&page={page}"
                try:
                    res = await self.scraper.get_json(page_url, headers=self.headers, model_id=self.domain)
                except Exception:
                    break

                items = res["products"]["items"]
                if not items: # we have gone through all the pages
                    break
                
                for item in items:
                    item_url = f"{self.base_url}{item['productLink']}"
                    primitive_item = PrimitiveItem(item_url=item_url, audience=audience)
                    primitive_items.append(primitive_item)
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
        
    async def get_extracted_item(self, doc: str, primitive_item: PrimitiveItem):
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
                       

class Transformer(BaseTransformer):
    def __init__(self, db_url: str, model_id: str):
        super().__init__(db_url=db_url, model_id=model_id)

    def transform(self, parsed_items: list[ParsedItem]) -> list[Item]:
        def get_sizes(offers: list[Offer]):
            sizes = {}
            for offer in offers:
                size = offer.sku.split("_")[-1]
                in_stock = offer.availability == 'InStock'
                sizes[size] = in_stock
            return sizes

        def get_categories(breadcrumbs: list[ListItem]):
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb.item.name
                rank = breadcrumb.position
                categories.append({"name": name, "rank": rank})
            return categories

        transformed_items = []
        for parsed_item in parsed_items:
            product_data = parsed_item.product_data
            breadcrumb_data = parsed_item.breadcrumb_data

            sizes = get_sizes(product_data.offers)
            categories = get_categories(breadcrumb_data.itemListElement)

            item = Item(
                item_url=parsed_item.item_url,
                audience=parsed_item.audience,
                item_id=product_data.productID,
                brand=product_data.brand.name.strip().lower().replace(" ", "_"), 
                domain=parsed_item.domain,
                country=parsed_item.country,
                name=product_data.name or product_data.productID,
                description=product_data.description,
                images=product_data.image,
                sizes=sizes,
                colors=parsed_item.colors,
                currency=product_data.offers[0].priceCurrency,
                price=product_data.offers[0].price,
                categories=categories
            )

            transformed_items.append(item)
        
        return transformed_items

    

    