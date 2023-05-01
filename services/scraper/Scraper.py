import requests
from lxml import etree, html
from requests.adapters import HTTPAdapter, Retry
import aiohttp
import asyncio

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

    async def http_session_async(self, session=None, retries=3, max_redirects=10):
        if session is None:
            session = aiohttp.ClientSession()
        
        # Retry mechanism
        async def request_with_retry(method, url, **kwargs):
            for retry_attempt in range(retries):
                try:
                    async with session.request(method, url, **kwargs) as response:
                        if response.status in (500, 502, 503, 504):
                            raise aiohttp.ClientError()
                        return response
                except (aiohttp.ClientError, aiohttp.ClientConnectorError, aiohttp.ClientPayloadError):
                    if retry_attempt == retries - 1:  # The last retry attempt
                        raise
                    await asyncio.sleep(0.3 * (2 ** retry_attempt))
        
        session.request_with_retry = request_with_retry
        return session

    
    async def get_json_async(self, url, headers=None, params=None, cookies=None, method="get", json=None, model_id=""):
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        async with aiohttp.ClientSession() as session:
            for _ in range(3):  # try to send the request 3 times
                try:
                    async with session.get(url, headers=headers, params=params, cookies=cookies) as response:
                        if response.status == 200:
                            return await response.json()
                        print(f"{model_id} - Error {response.status}")
                except Exception as e:
                    print(f"{model_id} - Exception get_json_async: {e}")

    async def get_html_async(self, url, headers=None, params=None, cookies=None, method="get", model_id=""):
        """will load a url and get the raw page source using http requests"""
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        async with aiohttp.ClientSession() as session:
            for _ in range(3):
                try:
                    async with session.get(url, headers=headers, params=params, cookies=cookies) as response:
                        if response.status == 200:
                            try:
                                text = await response.text()
                                doc = html.document_fromstring(text)
                            except:
                                content = await response.content()
                                doc = html.document_fromstring(content)
                            return doc
                        print(f"{model_id} - Error {response.status}")
                except etree.ParserError:
                    return
                except Exception as e:
                    print(f"{model_id} - Error get_html_async: {e}")
    
    def http_session(self, session=None, retries=3, max_redirects=10):
        session = session or requests.Session()
        if retries > 0:
            retry = Retry(total=retries, status_forcelist=(500, 502, 503, 504), backoff_factor=0.3)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('http://', adapter)
            session.mount('https://', adapter)
        session.max_redirects = max_redirects
        return session
    
    def get_json(self, url, headers=None, params=None, cookies=None, method="get", json=None, model_id=""):
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        for _ in range(3): # try to send the request 3 times
            try:
                response = self.http_session().request(
                    method,
                    url,
                    headers=headers,
                    params=params,
                    timeout=30,
                    json=json,
                    cookies=cookies,
                    proxies=self.proxies,
                )
                if response.status_code == 200:
                    return response.json()
                print(f"{model_id} - Error {response.status_code}")
            except Exception as e:
                print(f"{model_id} - Exception get_json: {e}")  

    def get_html(self, url, headers=None, params=None, cookies=None, method="get", model_id=""):
        """will load a url and get the raw page source using http requests"""
        if not headers:
            headers = self.headers
        if not cookies:
            cookies = self.cookies

        for _ in range(3):
            try:
                response = self.http_session().request(
                    method,
                    url,
                    headers=headers,
                    params=params,
                    cookies=cookies,
                    timeout=30,
                    proxies=self.proxies,
                )
                if response.status_code == 200:
                    try:
                        doc = html.document_fromstring(response.text)
                    except:
                        doc = html.document_fromstring(response.content)
                    return doc
                print(f"{model_id} - Error {response.status_code}")
            except etree.ParserError:
                return
            except Exception as e:
                print(f"{model_id} - Error get_html: {e}")