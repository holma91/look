from pydantic import BaseModel
import datetime

class Product(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    currency: str
    price: float
    updated_at: datetime.datetime
    