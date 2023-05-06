from Crawler import Crawler

# Moncler -https://www.moncler.com/en-us/

seeds = {
    "men-outerwear": "men",
    "men-footwear": "men",
    "men-accessories": "men",
    "men-ready-to-wear": "men",
    "grenoble-men": "men",
    "grenoble-women": "men",
    "women-accessories": "men",
    "women-footwear": "men",
    "women-outerwear": "men",
    "women-ready-to-wear": "men",
    "grenoble-children": "men",
    "children-baby-girl": "men",
    "children-girls": "men",
    "children-boys": "men",
    "children-baby-boy": "men",
}

headers = {
    'authority': 'www.moncler.com',
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9',
    'device': 'undefined',
    'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}

# type: API


class Model(Crawler):
    model_id = "moncler"

    def process_listing(self):
        for seed in seeds:
            api_url = "https://www.moncler.com/on/demandware.store/Sites-MonclerUS-Site/en_US/SearchApi-Search"
            for page in range(self.max_page):
                print(f"Process listing {api_url} page {page+1}")

                params = {
                    'cgid': seed,
                    'sz': '100',
                    'start': str(page * 100),
                }

                res = self.get_json(api_url, headers=headers, params=params)
                if res is None:
                    break

                items = res["data"]["products"]
                if not items:
                    break

                for item in items:
                    yield {"item_url": item['id'], "item_id": item['id']}

    def process_item(self, data):
        # uses API instead of schema.org
        item_id = data["item_id"]
        api_url = f"https://www.moncler.com/on/demandware.store/Sites-MonclerUS-Site/en_US/ProductApi-Product?pid={item_id}"
        product_data = self.get_json(api_url, headers=headers)
        if product_data is None:
            return

        item_url = f"https://www.moncler.com{product_data['selectedProductUrl']}"
        brand = "Moncler"
        name = product_data["productName"]
        description = product_data["longDescription"]
        images = product_data["imgs"]["urls"]

        sizes = []
        colors = []
        for variationAttribute in product_data["variationAttributes"]:
            if variationAttribute["attributeId"] == "color":
                for value in variationAttribute["values"]:
                    if value.get("selectable"):
                        colors.append(value["displayValue"])
            if variationAttribute["attributeId"] == "size":
                for value in variationAttribute["values"]:
                    if value.get("selectable"):
                        sizes.append(value["displayValue"])

        try:
            sales = product_data["price"]["sales"]
        except:
            sales = product_data["price"]["max"]["sales"]

        currency = sales["currency"]
        price = sales["value"]
        in_stock = product_data["available"]
        breadcrumb = product_data["breadcrumbs"]
        breadcrumb = [b["htmlValue"] for b in breadcrumb]

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
