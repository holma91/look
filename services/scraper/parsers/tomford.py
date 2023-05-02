from Crawler import Crawler

# Tom Ford - https://www.tomford.com/

seeds = [
    "https://www.tomford.com/men/ready-to-wear/",
    "https://www.tomford.com/men/underwear/",
    "https://www.tomford.com/men/shoes/",
    "https://www.tomford.com/men/bags/",
    "https://www.tomford.com/men/accessories/",
    "https://www.tomford.com/women/ready-to-wear/",
    "https://www.tomford.com/women/shoes/",
    "https://www.tomford.com/women/handbags/",
    "https://www.tomford.com/women/accessories/",
    "https://www.tomford.com/beauty/men/",
    "https://www.tomford.com/beauty/eyes/",
    "https://www.tomford.com/beauty/lips/",
    "https://www.tomford.com/beauty/face/",
    "https://www.tomford.com/beauty/fragrance/",
]


headers = {
    'authority': 'www.tomford.com',
    'accept': 'text/html, */*; q=0.01',
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
    model_id = "tomford"

    def process_listing(self):
        for seed in seeds:
            api_url = f"{seed}?sz=12&format=page-element&start="
            for page in range(self.max_page):
                page_url = f"{api_url}{page*12}"
                print(f"Process listing {page_url}")

                doc = self.get_html(page_url, headers=headers)
                if doc is None:
                    break

                items = doc.xpath('//a[@class="name-link"]/@href')
                if not items:
                    break

                for item_url in items:
                    yield {"item_url": item_url}

    def process_item(self, data):
        item_url = data["item_url"]
        doc = self.get_html(item_url, headers=headers)
        if doc is None:
            return

        brand = doc.xpath('string(//meta[@property="og:brand"]//@content)')
        name = doc.xpath('string(//meta[@property="og:title"]//@content)')
        description = doc.xpath('string(//meta[@property="og:description"]//@content)')

        image = doc.xpath('string(//meta[@property="og:image"]//@content)')
        images = doc.xpath('//img[contains(@class,"primary-image")]/@data-src')
        images.append(image)

        item_id = doc.xpath('string(//span[@itemprop="productID"]/text())')

        sizes = doc.xpath(
            '//div[@class="pdp-size-wrapper"]//option[not(@data-btclass="disabled")]/text()'
        )[1:]
        sizes = [s.strip() for s in sizes]

        colors = doc.xpath('//span[@itemprop="color"]/text()')
        colors = [c.strip() for c in colors]

        currency = doc.xpath('string(//span[@itemprop="priceCurrency"]/@content)')
        price = doc.xpath('string(//span[@itemprop="price"]/@content)')
        in_stock = doc.xpath('string(//meta[@property="og:availability"]//@content)') == 'instock'
        breadcrumb = doc.xpath('//li[@property="itemListElement"]/a/span/text()')

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
