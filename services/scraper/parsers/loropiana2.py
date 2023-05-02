import json

from Crawler import Crawler

# Loro Piana -https://us.loropiana.com/en/

seeds = [
    "https://us.loropiana.com/en/c/L1_MEN/results",
    "https://us.loropiana.com/en/c/L1_WOM/results",
]

headers = {
    'authority': 'us.loropiana.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
}

# type: API

class Model(Crawler):
    model_id = "loropiana"

    def process_listing(self):
        for seed in seeds:
            for page in range(self.max_page):
                page_url = f"{seed}?page={page+1}"
                print(f"Process listing {page_url}")

                res = self.get_json(page_url, headers=headers)
                if res is None:
                    break

                items = res["results"]
                if not items:
                    break

                for item in items:
                    item_url = f"https://us.loropiana.com{item['url']}"
                    yield {"item_url": item_url}

    def process_item(self, data):
        item_url = data["item_url"]
        doc = self.get_html(item_url, headers=headers)
        if doc is None:
            return

        product_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[0].text)
        breadcrumb_data = json.loads(doc.xpath('//script[@type="application/ld+json"]')[1].text)

        item_id = product_data["sku"]
        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = product_data["image"]

        try:
            size_data = json.loads(
                doc.xpath('//div[@data-size-guide-json]/@data-size-guide-json')[0]
            )["data"]
            sizes = [s["sizeList"] for s in size_data if s["name"] == "USA"][0]
        except:
            sizes = []

        colors = [product_data["color"]]
        currency = product_data["offers"]["priceCurrency"]
        price = product_data["offers"]["price"] if currency else ""
        in_stock = product_data["offers"]["availability"] == 'http://schema.org/InStock'
        breadcrumb = [b["name"] for b in breadcrumb_data["itemListElement"]]

        try:
            category = breadcrumb[breadcrumb.index("Man") + 1]
        except:
            try:
                category = breadcrumb[breadcrumb.index("Woman") + 1]
            except:
                category = None

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
            "category": category,
        }

        return response
