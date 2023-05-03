import json
from lxml import html

from pydantic import BaseModel

from Scraper import Scraper
from Types import PrimitiveItem, Item
from BaseParser import BaseParser
from BaseTransformer import BaseTransformer

class ParsedItem(BaseModel):
    item_url: str
    audience: str
    domain: str
    country: str
    product_data: dict
    breadcrumb_data: dict
    colors: list
    extra_description: str

class Gucci(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="gucci", domain="gucci.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        for seed, audience in self.seeds.items():
            api_url = f"{self.base_url}/c/productgrid?categoryCode={seed}&show=Page"
            primitive_items = []
            for page in range(1):
            # for page in range(self.scraper.max_page):
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
                    if (len(primitive_items) >= 10):
                        break
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed
        
    async def get_extracted_item(self, primitive_item: PrimitiveItem, headers: dict) -> ParsedItem:
        def create_extracted_item(doc: str, primitive_item: PrimitiveItem):
            product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
            breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)
            assert product_data['@type'] == 'Product'
            assert breadcrumb_data['@type'] == 'BreadcrumbList'

            colors = list(set(doc.xpath('//span[@class="color-material-name"]/text()')))
            extra_description = doc.xpath('//*[@id="product-details"]')
            formatted_extra_description = html.tostring(extra_description[0], pretty_print=True, encoding='unicode')

            item = ParsedItem(
                item_url=primitive_item.item_url,
                audience=primitive_item.audience,
                domain=self.domain,
                country=self.country,
                product_data=product_data, 
                breadcrumb_data=breadcrumb_data, 
                colors=colors,
                extra_description=formatted_extra_description
            )

            return item
        
        try:
            doc = await self.scraper.get_html(primitive_item.item_url, headers=headers, model_id=self.domain)
            item = create_extracted_item(doc, primitive_item)
            return item
        except Exception as e:
            print(e)
            return None
               

class Transformer(BaseTransformer):
    def __init__(self, db_url: str, model_id: str):
        super().__init__(db_url=db_url, model_id=model_id)

    def transform(self, parsed_items: list[ParsedItem]) -> list[Item]:
        def get_sizes(offers: list[dict]):
            sizes = {}
            for offer in offers:
                size = offer["sku"].split("_")[-1]
                in_stock = offer["availability"] == 'InStock'
                sizes[size] = in_stock
            return sizes

        def get_categories(breadcrumbs: list[dict]):
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb["item"]["name"]
                rank = breadcrumb["position"]
                categories.append({"name": name, "rank": rank})
            return categories

        transformed_items = []
        for parsed_item in parsed_items:
            product_data = parsed_item.product_data
            breadcrumb_data = parsed_item.breadcrumb_data

            item_id = product_data["productID"]

            brand = product_data["brand"]["name"]
            name = product_data["name"]
            description = product_data["description"]
            images = product_data["image"]
            
            colors = parsed_item.colors
            currency = product_data["offers"][0]["priceCurrency"]
            price = product_data["offers"][0]["price"]

            breadcrumbs = breadcrumb_data["itemListElement"]

            sizes = get_sizes(product_data["offers"])
            categories = get_categories(breadcrumbs)

            item = Item(
                item_url=parsed_item.item_url,
                audience=parsed_item.audience,
                item_id=item_id,
                brand=brand.strip().lower().replace(" ", "_"), 
                domain=parsed_item.domain,
                country=parsed_item.country,
                name=name,
                description=description,
                images=images,
                sizes=sizes,
                colors=colors,
                currency=currency,
                price=price,
                categories=categories
            )

            transformed_items.append(item)
        
        return transformed_items

    

    