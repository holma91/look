from pydantic import BaseModel
import datetime



class UserSchema(BaseModel):
    id: str

class WebsiteSchema(BaseModel):
    domain: str
    multi_brand: bool
    second_hand: bool

class WebsiteUserSchema(WebsiteSchema):
    is_favorite: bool

class Product(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    updated_at: datetime.datetime