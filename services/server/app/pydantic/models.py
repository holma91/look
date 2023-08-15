import datetime

from pydantic import BaseModel

class User(BaseModel):
    id: str

class Product(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    currency: str
    price: float
    updated_at: datetime.datetime

class Company(BaseModel):
    id: str