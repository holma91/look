import json
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import redis
import requests
from lxml import etree, html
from pymongo import MongoClient
from requests.adapters import HTTPAdapter, Retry


class Basic:
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

    def start(self):
        primitive_items = self.get_primitive_items()
        print(json.dumps(primitive_items))
        pass
    
    def get_primitive_items(self):
        pass
    
    def http_session(self, session=None, retries=3, max_redirects=10):
        session = session or requests.Session()
        if retries > 0:
            retry = Retry(total=retries, status_forcelist=(500, 502, 503, 504), backoff_factor=0.3)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('http://', adapter)
            session.mount('https://', adapter)
        session.max_redirects = max_redirects
        return session
    
    def get_json(self, url, headers=None, params=None, cookies=None, method="get", json=None):
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
                print(f"{self.model_id} - Error {response.status_code}")
            except Exception as e:
                print(f"{self.model_id} - Exception get_json: {e}")  
