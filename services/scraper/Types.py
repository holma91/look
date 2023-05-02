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


class ExtractedItem(BaseModel):
    item_url: str
    audience: str
    product_data: dict
    breadcrumb_data: dict
    other_data: dict