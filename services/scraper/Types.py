from pydantic import BaseModel

class Primitive_Item(BaseModel):
    item_id: str
    item_url: str
    audience: str

class Item(Primitive_Item):
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