from pydantic import BaseModel

class Product(BaseModel):
    url: str
    brand: str
    name: str