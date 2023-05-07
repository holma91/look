from typing import Optional, Union

from pydantic import BaseModel, HttpUrl

class PrimitiveItem(BaseModel):
    item_url: str
    item_api_url: Optional[str]
    audience: str

class Size(BaseModel):
    size: str
    in_stock: bool

class Category(BaseModel):
    name: str
    rank: str

class Color(BaseModel):
    name: str

## make this class more exact
class Item(PrimitiveItem):
    item_id: str
    brand: str
    domain: str
    country: str
    name: str
    description: str
    currency: Union[str, None]
    price: Union[str, None]
    images: list[HttpUrl]
    sizes: list[Size]
    categories: list[Category]
    colors: list[Color]

