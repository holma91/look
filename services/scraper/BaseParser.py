import time
import asyncio

from datetime import datetime
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

        tasks = []
        for _, primitive_items in primitive_items_by_seed.items():
            for primitive_item in primitive_items:
                task = asyncio.create_task(self.get_extracted_item(primitive_item, self.headers))
                tasks.append(task)

        parsed_items: list = await asyncio.gather(*tasks)

        failed_tasks = []
        for i in range(len(tasks)):
            if parsed_items[i] is None:
                failed_tasks.append(tasks[i])

        print(failed_tasks)
        print('len:', len(failed_tasks))

        # need to recreate the tasks
        await asyncio.sleep(10)
        parsed_items2 = await asyncio.gather(*failed_tasks)
        parsed_items += parsed_items2

        with open(output_file, 'w') as file:
            for item in parsed_items:
                if item is not None:
                    file.write(item.json() + '\n')

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        raise NotImplementedError("This method should be implemented in a subclass.")

    async def get_extracted_item(self, primitive_item: PrimitiveItem, headers: dict) -> any:
        raise NotImplementedError("This method should be implemented in a subclass.")