import json

from Scraper import Scraper
from Types import PrimitiveItem, Item, Size, Category, Color
from BaseParser import BaseParser

class Parser(BaseParser):
    def __init__(self, country: str, scraper: Scraper, scraping_type: str):
        super().__init__(country, scraper,  scraping_type, brand="gucci", domain="gucci.com")

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
        
    async def get_extracted_item(self, src: str, primitive_item: PrimitiveItem):
        def get_sizes(offers: list) -> list[Size]:
            sizes = []
            for offer in offers:
                size = offer['sku'].split("_")[-1]
                in_stock = offer['availability'] == 'InStock'
                sizes.append(Size(size=size, in_stock=in_stock))

            return sizes

        def get_categories(breadcrumbs: list) -> list[Category]:
            categories = []
            for breadcrumb in breadcrumbs:
                name = breadcrumb['item']['name']
                rank = breadcrumb['position']
                categories.append(Category(name=name, rank=rank))
            return categories
        
        def get_colors(color_data: list) -> list[Color]:
            colors = []
            for color in color_data:
                colors.append(Color(name=color))
            return colors
        
        product_data = json.loads(src.xpath('//script[@type="application/ld+json"]')[0].text, strict=False)
        breadcrumb_data = json.loads(src.xpath('//script[@type="application/ld+json"]')[1].text, strict=False)

        images = product_data.get('image', [])
        if isinstance(images, str):
            images = [images]

        offers = product_data.get('offers', [])

        if offers:
            currency = product_data['offers'][0]['priceCurrency']
            price = product_data['offers'][0]['price']
        else:
            currency = None
            price = None

        sizes = get_sizes(offers)
        categories = get_categories(breadcrumb_data.get('itemListElement', []))
        colors = get_colors(list(set(doc.xpath('//span[@class="color-material-name"]/text()'))))


        item = Item(
            item_url=primitive_item.item_url,
            audience=primitive_item.audience,
            domain=self.domain,
            country=self.country,
            item_id=product_data['productID'],
            brand=product_data['brand']['name'].strip().lower().replace(" ", "_"), 
            name=product_data['name'] or product_data['productID'],
            description=product_data['description'],
            images=images,
            currency=currency,
            price=price,
            sizes=sizes,
            categories=categories,
            colors=colors,
        )

        return item


    