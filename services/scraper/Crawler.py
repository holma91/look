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

mongodb_client = MongoClient()
r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
# r.flushall()


class Crawler:
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
        pill2kill = threading.Event()
        t1 = threading.Thread(target=self.start_item_process, args=(pill2kill,))
        t1.start() # calls start_item_process(pill2kill)

        print("hey")

        for listing_data in self.process_listing():
            today = datetime.today().strftime('%d-%m-%Y')
            key = f"{self.model_id}_{listing_data['item_url']}_{today}_listing"
            if r.get(key) == "scraping_done":
                self.data_duplicate += 1
                print("Skipping duplicate", key)
            else:
                r.set(key, json.dumps(listing_data))

        while True:
            keys = r.keys(pattern=f"{self.model_id}_*")
            scraping_complete = True
            for key in keys:
                if r.get(key) != "scraping_done":
                    scraping_complete = False
                    continue
            if scraping_complete:
                pill2kill.set()
                t1.join()
                break
            time.sleep(1)
        print("Done scraping", self.model_id)
        today = datetime.today().strftime('%d-%m-%Y %H:%M:%S')
        with open("report.txt", "a") as f:
            f.write(
                f"[{today}] Scraped:{self.data_scraped} | Failed:{self.data_failed} | Duplicate:{self.data_duplicate} - {self.model_id}"
            )
            f.write("\n")

    def start_item_process(self, stop_event):
        """"""
        # pill2kill is the stop_event
        while not stop_event.wait(1):
            # check in redis cache for all the keys that have previously been scraped
            keys = r.keys(pattern=f"{self.model_id}_*")
            items_to_process = []
            for key in keys:
                item = r.get(key)
                if not item or item == "scraping_done":
                    continue
                else:
                    item = json.loads(r.get(key))
                    items_to_process.append({key: item})
            
            # now items_to_process contains all items that was previously scraped and should be scraped again

            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                future_mapping = {}
                futures = []
                for item_to_process in items_to_process:
                    for key, item in item_to_process.items():
                        future = executor.submit(self.process_item, item)
                        future_mapping[future] = key
                        futures.append(future)

                for future in futures:
                    key = future_mapping[future]

                    processed_item = None
                    # processed_item = future.result()
                    try:
                        processed_item = future.result()
                    except Exception as e:
                        print(f"{self.model_id} - Error in key {key}: {e}")
                        today = datetime.today().strftime('%d-%m-%Y %H:%M:%S')
                        with open("problems.txt", "a") as f:
                            f.write(f"[{today}] {self.model_id} - Error in key {key}: {e}")
                            f.write("\n")

                    if processed_item:
                        today = datetime.today().strftime('%d-%m-%Y')
                        if type(processed_item) is list:
                            for item in processed_item:
                                item_url = item["item_url"]
                                item["pk"] = f"{self.model_id}_{item_url}_{today}"
                                self.addToDatabase(item)
                        else:
                            item_url = processed_item["item_url"]
                            processed_item["pk"] = f"{self.model_id}_{item_url}_{today}"
                            self.addToDatabase(processed_item)
                    else:
                        self.data_failed += 1
                        print("Failed to scrape", key)

                    print("redis key", key)
                    r.set(key, "scraping_done")

    def addToDatabase(self, item):
        item = self.mutate_item(item)
        self.data_scraped += 1
        collection = mongodb_client["fashion_products"]["products"]
        collection.update_one({'pk': item["pk"]}, {"$set": item}, upsert=True)
        print(self.data_scraped, "- Scraped:", item["item_url"])

    def process_listing(self):
        """works in a single thread"""
        pass

    def process_item(self, data):
        """works in multiple threads"""
        pass

    def mutate_item(self, item):
        """can be used to do any final modification to the data object before pushing to database"""
        return item

    def http_session(self, session=None, retries=3, max_redirects=10):
        """handles retries for all the HTTP adapters"""
        session = session or requests.Session()
        if retries > 0:
            retry = Retry(total=retries, status_forcelist=(500, 502, 503, 504), backoff_factor=0.3)
            adapter = HTTPAdapter(max_retries=retry)
            session.mount('http://', adapter)
            session.mount('https://', adapter)
        session.max_redirects = max_redirects
        return session

    def get_html(self, url, headers=None, params=None, cookies=None, method="get"):
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
                print(f"{self.model_id} - Error {response.status_code}")
            except etree.ParserError:
                return
            except Exception as e:
                print(f"{self.model_id} - Error get_html: {e}")

    def get_json(self, url, headers=None, params=None, cookies=None, method="get", json=None):
        """will load an API url and return the JSON response"""
        print('in get_json', url)
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
                    timeout=30,
                    json=json,
                    cookies=cookies,
                    proxies=self.proxies,
                )
                if response.status_code == 200:
                    return response.json()
                print(f"{self.model_id} - Error {response.status_code}")
            except Exception as e:
                print(f"{self.model_id} - Error get_json: {e}")
