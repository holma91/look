from lxml import html

class Scraper:
    model_id = ""
    proxies = {}
    max_workers = 10
    max_page = 1000
    data_scraped = 0
    data_failed = 0
    data_duplicate = 0
    cookies = None
    headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    }

    def __init__(self, session, proxy_url: str, premium_proxy_url: str):
        self.session = session
        self.proxy_url = proxy_url
        self.premium_proxy_url = premium_proxy_url

    async def get_json(self, url, headers=None, cookies=None, model_id=""):
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        for _ in range(3):
            try:
                async with self.session.get(url, headers=headers, cookies=cookies, proxy=self.proxy_url, ssl=False) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        # try again with premium proxy?
                        print(f"{model_id} - Error with status: {response.status} when getting json from url: {url}")
            except Exception as e:
                print(f"{model_id} - Exception get_json: {e} with url: {url}")

    async def get_html(self, url, headers=None, cookies=None, model_id=""):
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        for _ in range(3):
            try:
                async with self.session.get(url, headers=headers, proxy=self.proxy_url, cookies=cookies, ssl=False) as response:
                    if response.status == 200:
                        try:
                            text = await response.text()
                            doc = html.document_fromstring(text)
                        except:
                            content = await response.content()
                            doc = html.document_fromstring(content)
                        return doc
                    else:
                        print(f"{model_id} - Error with status: {response.status} when getting html from {url}")
            except Exception as e:
                print(f"{model_id} - Exception in get_html: {e} with url: {url}")
    
    