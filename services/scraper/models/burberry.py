import json

from Crawler import Crawler

# Burberry - https://us.burberry.com/

seeds = [
    "/cat8380085/cat8390036",
    "/cat1350151/cat8460064/cat8460066",
    "/cat1350151/cat2000023/cat3430048",
    "/cat1350151/cat1350397/cat6720026",
    "/cat1350151/cat1350436/cat2010032",
    "/cat1350151/cat1360052/cat3430074",
    "/cat1350151/cat3650028/cat1350449",
    "/cat1350151/cat1360088/cat3430168",
    "/cat1350556/cat8460076/cat8460086",
    "/cat1350556/cat1360189/cat3430286",
    "/cat1350556/cat3650040/cat1350818",
    "/cat1350556/cat3890078/cat3890080",
    "/cat1350556/cat8800113/cat8800115",
    "/cat1350882/cat3730101/cat3730103",
    "/cat1350882/cat1990038/cat3430320",
    "/cat1350882/cat1990046/cat3430322",
    "/cat1350882/cat5810024/cat5810026",
]

headers = {
    'authority': 'us.burberry.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
}

# type: API

class Model(Crawler):
    model_id = "burberry"

    def process_listing(self):
        for seed in seeds:
            api_url = "https://us.burberry.com/web-api/pages/products"
            for page in range(self.max_page):
                print(f"Process listing {api_url} page {page+1}")

                params = {
                    'location': seed,
                    'offset': str(page * 20),
                    'limit': '20',
                    'language': 'en',
                    'country': 'US',
                }

                res = self.get_json(api_url, headers=headers, params=params)
                if res is None:
                    break

                items = res["data"][0]["items"]
                if not items:
                    break

                for item in items:
                    item_url = f"https://us.burberry.com{item['url']}"
                    yield {"item_url": item_url}

    def process_item(self, data):
        item_url = data["item_url"]
        doc = self.get_html(item_url, headers=headers)
        if doc is None:
            return

        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[2].text)

        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = doc.xpath(
            '//picture[@class="desktop-product-gallery__image__picture"]/source//@data-srcset'
        )

        images = list(set([f"https:{i.split()[0].split('&')[0]}" for i in images]))
        item_id = product_data["sku"]

        sizes = doc.xpath('//label[@class="size-picker__size-box"]/@value')

        colors = [product_data["color"]]
        currency = product_data["offers"]["priceCurrency"]
        price = product_data["offers"]["price"]
        in_stock = product_data["offers"].get("availability") == 'http://schema.org/InStock'
        breadcrumb = doc.xpath('//li[@class="breadcrumbs__item"]//a/text()')
        breadcrumb = [b.strip() for b in breadcrumb if b.strip()]

        response = {
            "item_id": item_id,
            "item_url": item_url,
            "brand": brand,
            "name": name,
            "description": description,
            "images": images,
            "sizes": sizes,
            "colors": colors,
            "currency": currency,
            "price": price,
            "in_stock": in_stock,
            "breadcrumb": breadcrumb,
            "category": next(iter(breadcrumb[1:2]), None),
        }

        return response
