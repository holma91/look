from typing import Optional

from pydantic import BaseModel
import datetime

### GENERIC RESPONSE MODELS ###

class POSTResponse(BaseModel):
    status: str
    message: str

### BASE MODELS ###

class UserBase(BaseModel):
    id: str

class ProductBase(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str

class WebsiteBase(BaseModel):
    domain: str
    multi_brand: bool
    second_hand: bool

### REQUEST MODELS ###

class LikeProduct(BaseModel):
    product_url: str

### RESPONSE MODELS ###

class UserExtended(UserBase):
    favorites: list[str]
    likes: list[str]

class UserLiked(ProductBase):
    images: list[str]

class UserHistory(ProductBase):
    liked: bool
    images: list[str]

class ProductExtended(ProductBase):
    images: list[str]

class UserSchema(BaseModel):
    id: str

class WebsiteExtended(WebsiteBase):
    is_favorite: bool
