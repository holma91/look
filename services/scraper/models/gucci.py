import json

from Crawler import Crawler

seeds = {
    "women-handbags": "Handbags",
    "women-accessories-lifestyle-bags-and-luggage": "Accessories",
    "women-readytowear": "Ready To Wear",
    "women-shoes": "Shoes",
    "women-accessories-wallets": "Accessories",
    "women-accessories-belts": "Accessories",
    "jewelry-watches-watches-women": "Watches",
    "men-bags": "Bags",
    "men-bags-trolleys": "Bags",
    "men-readytowear": "Ready To Wear",
    "men-shoes": "Shoes",
    "men-accessories-wallets": "Accessories",
    "jewelry-watches-watches-men": "Watches",
}

headers = {
    'authority': 'www.gucci.com',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}

# type: API

class Model(Crawler):
    model_id = "gucci"

    def process_listing(self):
        for seed, category in seeds.items():
            print("seed", seed, "category", category)
            api_url = f"https://www.gucci.com/fi/en_gb/c/productgrid?categoryCode={seed}&show=Page"
            for page in range(self.max_page):
                page_url = f"{api_url}&page={page}"
                print(f"Process listing {page_url}")

                res = self.get_json(page_url, headers=headers)
                if not res:
                    break
                items = res["products"]["items"]
                if not items:
                    break

                for item in items:
                    item_url = f"https://www.gucci.com/fi/en_gb{item['productLink']}"
                    yield {
                        "item_id": item["productCode"],
                        "item_url": item_url,
                        "category": category,
                    }

    def process_item(self, data):
        # data is of type {item_id: string, item_url: string, category: string}
        print("data", data)
        item_url = data["item_url"]
        item_id = data["item_id"]
        category = data["category"]
        doc = self.get_html(item_url, headers=headers)
        if doc is None:
            return
        
        # so, he only uses the api for item_id, item_url, category

        product_data = json.loads(
            doc.xpath('//script[@type="application/ld+json"]')[0].text, strict=False
        )
        breadcrumb_data = json.loads(
            doc.xpath('//script[@type="application/ld+json"]')[1].text, strict=False
        )

        # print("product_data", product_data)
        # print("breadcrumb_data", breadcrumb_data)

        brand = product_data["brand"]["name"]
        name = product_data["name"]
        description = product_data["description"]
        images = product_data["image"]
        sizes = doc.xpath('//select[@name="size"]/option[@data-available="true"]/text()')
        sizes = list(set([s.strip() for s in sizes]))
        colors = list(set(doc.xpath('//span[@class="color-material-name"]/text()')))
        currency = product_data["offers"][0]["priceCurrency"]
        price = product_data["offers"][0]["price"]
        in_stock = product_data["offers"][0]["availability"] == 'InStock'
        breadcrumb = [b["item"]["name"] for b in breadcrumb_data["itemListElement"]]

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
