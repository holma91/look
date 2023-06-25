from typing import Optional

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

# Sometimes we don't NEED images because e.g. we don't wanna do a join for just a return value
class Product(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: Optional[list[str]] = None
    updated_at: Optional[datetime.datetime] = None


# Sometimes we NEED images
class ProductStrict(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: list[str]
    updated_at: Optional[datetime.datetime] = None

class ProductUser(Product):
    liked: bool

class UserProduct(BaseModel):
    user_id: str
    product_url: str
    liked: bool