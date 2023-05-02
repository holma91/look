from typing import Optional

from pydantic import BaseModel

class PrimitiveItem(BaseModel):
    item_url: str
    audience: str

class Item(PrimitiveItem):
    brand: str
    domain: str
    country: str
    name: str
    description: str
    images: list
    sizes: dict
    colors: list
    currency: str
    price: str
    breadcrumbs: list


class ParsedItem(BaseModel):
    item_url: str
    audience: str
    product_data: Optional[dict] = None
    breadcrumb_data: Optional[dict] = None
    other_data: Optional[dict] = None