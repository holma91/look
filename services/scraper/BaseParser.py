import time
import logging
import asyncio

from datetime import datetime
from pydantic import ValidationError

from Scraper import Scraper
from Types import PrimitiveItem
from utils.information import information

class BaseParser:
    "does some light parsing and puts the results into S3"
    def __init__(self, country: str, scraper: Scraper, brand: str, domain: str):
        self.country = country
        self.scraper = scraper
        self.brand = brand
        self.domain = domain

        info = information[self.brand]
        self.base_url = info['urls'][country]
        self.headers = info['headers']
        self.seeds = info['seeds']

    async def start(self):
        start_time = time.time()
        primitive_items_by_seed = await self.get_primitive_items()
        print(f'{self.brand} - get_primitive_items time: %.2f seconds.' % (time.time() - start_time))

        start_time = time.time()
        await self.process_primitive_items(primitive_items_by_seed)
        print(f'{self.brand} - process_items time: %.2f seconds.' % (time.time() - start_time))

    async def process_primitive_items(self, primitive_items_by_seed: dict[str, list[PrimitiveItem]]):
        today = datetime.today()
        date_str = today.strftime('%Y-%m-%d')
        output_file = f'./results/{self.brand}/{date_str}.jsonl'

        all_primitive_items = [primitive_item 
                            for _, primitive_items in primitive_items_by_seed.items()
                            for primitive_item in primitive_items]

        parsed_items: list = await self.get_parsed_items(all_primitive_items)

        with open(output_file, 'w') as file:
            for item in parsed_items:
                if item is not None:
                    file.write(item.json() + '\n')

    async def get_parsed_items(self, items, max_retries=2, retry_delay=10):
        """Process a list of primitive items and return the parsed results. Automatically retries."""
        results = [None for _ in items]
        retries = -1

        while retries < max_retries:
            tasks = []
            for item, result in zip(items, results):
                if result is None:
                    task = asyncio.create_task(self.process_item(item, self.headers))
                    tasks.append(task)

            print("len(tasks):", len(tasks))

            if not tasks:
                # all tasks are successful
                break

            if retries >= 0:
                await asyncio.sleep(retry_delay)

            new_results = await asyncio.gather(*tasks)

            new_result_index = 0
            for i in range(len(results)):
                if results[i] is None:
                    results[i] = new_results[new_result_index]
                    new_result_index += 1

            retries += 1

        return results
    
    async def process_item(self, primitive_item: PrimitiveItem, headers: dict):
        # this method can be overridden in a subclass
        """If this method returns None, the job will be considered failed and retried."""
        try:
            doc = await self.scraper.get_html(primitive_item.item_url, headers=headers, model_id=self.domain)
            item = await self.get_extracted_item(doc, primitive_item)
            return item
        except ValidationError as e:
            logging.error(f"validation error for url {primitive_item.item_url}: {e}")
            print('validation error:', e)
            return None
        except Exception as e:
            print("an exception", e)
            logging.error(f"exception for url {primitive_item.item_url}: {e}")
            return None

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        raise NotImplementedError("This method should be implemented in a subclass.")

    async def get_extracted_item(self, doc: str, primitive_item: PrimitiveItem) -> any:
        raise NotImplementedError("This method should be implemented in a subclass.")