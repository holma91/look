from Scraper import Scraper
from Types import PrimitiveItem, ExtractedItem
from BaseParser import BaseParser

class LoroPiana(BaseParser):
    def __init__(self, country: str, scraper: Scraper):
        super().__init__(country, scraper, brand="loropiana", domain="loropiana.com")

    async def get_primitive_items(self) -> dict[str, list[PrimitiveItem]]:
        # Implement the method for Louis Vuitton
        pass

    async def get_extracted_item(self, primitive_item: PrimitiveItem, headers: dict) -> ExtractedItem:
        # Implement the method for Louis Vuitton
        pass