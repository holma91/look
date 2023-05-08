import json

from Scraper import Scraper
from Types import PrimitiveItem, Item, Size, Category, Color
from BaseParser import BaseParser

# when, the parser fails, we know that page structure has changed
class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper, scraping_type: str):
        super().__init__(country, scraper, scraping_type, brand="loro_piana", domain="loropiana.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        primitive_items_by_seed = {}
        for seed, audience in self.seeds.items():
            api_url = f"{self.base_url}{seed}"
            primitive_items = []
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
            
            primitive_items_by_seed[seed] = primitive_items
        
        return primitive_items_by_seed

    async def get_extracted_item(self, src: str, primitive_item: PrimitiveItem):
        def get_sizes(size_data: list) -> list[Size]:
            sizes = []
            for size_info in size_data:
                size = size_info['code']
                in_stock = size_info['stock']['stockLevelStatus']['code'] == 'inStock'
                sizes.append(Size(size=size, in_stock=in_stock))
            return sizes

        def get_categories(breadcrumbs: list) -> list[Category]:
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb['name']
                rank = breadcrumb['position']
                categories.append(Category(name=name, rank=rank))
            return categories
        
        def get_color(color_data: str) -> list[Color]:
            return [Color(name=color_data)]
        
        product_data = json.loads(src.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(src.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)

        images = product_data['image']
        if isinstance(images, str):
            images = [images]

        sku = product_data['sku']
        article_code, color_code = sku.rsplit("_", 1)
        product_url = f"{self.base_url}/api/pdp/product-variants?articleCode={article_code}&colorCode={color_code}"
        article = await self.scraper.get_json(product_url, headers=self.headers, model_id=self.domain)

        sizes = get_sizes(article[0]['sizes'])
        categories = get_categories(breadcrumb_data['itemListElement'])
        colors = get_color(product_data['color'])

        item = Item(
            item_url=primitive_item.item_url,
            audience=primitive_item.audience,
            domain=self.domain,
            country=self.country,
            item_id=product_data['sku'],
            brand=product_data['brand']['name'].strip().lower().replace(" ", "_"), 
            name=product_data['name'] or product_data['sku'],
            description=product_data['description'],
            images=images,
            currency=product_data['offers']['priceCurrency'],
            price=product_data['offers']['price'],
            sizes=sizes,
            categories=categories,
            colors=colors,
        )

        return item
        