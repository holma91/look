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
    sizes: list
    extra_description: str

class LoroPiana(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="loro_piana", domain="loropiana.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        for seed, audience in self.seeds.items():
            api_url = f"{self.base_url}{seed}"
            primitive_items = []
            for page in range(1):
            # for page in range(self.scraper.max_page):
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
                    if (len(primitive_items) >= 10):
                        break
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed

    async def get_extracted_item(self, primitive_item: PrimitiveItem, headers: dict) -> ParsedItem:
        async def create_extracted_item(doc: str, primitive_item: PrimitiveItem):
            product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
            breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)
            assert product_data['@type'] == 'Product'
            assert breadcrumb_data['@type'] == 'BreadcrumbList'

            sku = product_data['sku']
            article_code, color_code = sku.rsplit("_", 1)
            product_url = f"{self.base_url}/api/pdp/product-variants?articleCode={article_code}&colorCode={color_code}"
            article = await self.scraper.get_json(product_url, headers=headers, model_id=self.domain)
            sizes = article[0]['sizes']

            extra_description = doc.xpath('//*[@id="productDetail"]')
            formatted_extra_description = html.tostring(extra_description[0], pretty_print=True, encoding='unicode')

            item = ParsedItem(
                item_url=primitive_item.item_url,
                audience=primitive_item.audience,
                domain=self.domain,
                country=self.country,
                product_data=product_data, 
                breadcrumb_data=breadcrumb_data, 
                sizes=sizes,
                extra_description=formatted_extra_description
            )

            return item
        
        try:
            doc = await self.scraper.get_html(primitive_item.item_url, headers=headers, model_id=self.domain)
            item = await create_extracted_item(doc, primitive_item)
            return item
        except Exception as e:
            print(e)
            return None
        

class Transformer(BaseTransformer):
    def __init__(self, db_url: str, model_id: str):
        super().__init__(db_url=db_url, model_id=model_id)
    
    def transform(self, parsed_items: list[ParsedItem]) -> list[Item]:
        def get_sizes(sizes_info: list) -> dict:
            sizes = {}
            for size_info in sizes_info:
                size = size_info['code']
                in_stock = size_info['stock']['stockLevelStatus']['code'] == 'inStock'
                sizes[size] = in_stock
            return sizes

        def get_categories(breadcrumbs: list[dict]):
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb["name"]
                rank = breadcrumb["position"]
                categories.append({"name": name, "rank": rank})
            return categories
        
        transformed_items = []
        for parsed_item in parsed_items:
            product_data = parsed_item.product_data
            breadcrumb_data = parsed_item.breadcrumb_data

            item_id = product_data["sku"]

            brand = product_data["brand"]["name"]
            name = product_data["name"]
            description = product_data["description"]
            images = product_data["image"]
            if not isinstance(images, list):
                images = [images]
            
            colors = [product_data["color"]]
            currency = product_data["offers"]["priceCurrency"]
            price = product_data["offers"]["price"]

            breadcrumbs = breadcrumb_data["itemListElement"]

            sizes = get_sizes(parsed_item.sizes)
            categories = get_categories(breadcrumbs)

            item = Item(
                item_url=parsed_item.item_url,
                audience=parsed_item.audience,
                item_id=item_id,
                brand=brand.lower(), 
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