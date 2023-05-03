from typing import Optional

from pydantic import BaseModel

class PrimitiveItem(BaseModel):
    item_url: str
    audience: str

class Item(PrimitiveItem):
    item_id: str
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
    categories: list


class TransformedItem(BaseModel):
    pass