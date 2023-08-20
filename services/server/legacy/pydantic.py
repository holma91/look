from typing import Optional

from pydantic import BaseModel
from humps import camelize

# https://medium.com/analytics-vidhya/camel-case-models-with-fast-api-and-pydantic-5a8acb6c0eee
def to_camel(string):
    return camelize(string)

class CustomBaseModel(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True

### GENERIC RESPONSE MODELS ###

class POSTResponse(CustomBaseModel):
    status: str
    message: str

class POSTResponseAddImage(CustomBaseModel):
    success: bool
    message: str

### BASE MODELS ###

class UserBase(CustomBaseModel):
    id: str

class ProductBase(CustomBaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str

class WebsiteBase(CustomBaseModel):
    domain: str

class CompanyBase(CustomBaseModel):
    id: str

class ListBase(CustomBaseModel):
    id: str

### REQUEST MODELS ###

class LikeProduct(CustomBaseModel):
    product_url: str

class LikeProducts(CustomBaseModel):
    product_urls: Optional[list[str]]

class FavoriteWebsite(CustomBaseModel):
    domain: str

class FavoriteCompany(CustomBaseModel):
    id: str

class ProductImage(CustomBaseModel):
    product_url: str
    image_url: str

class ProductImages(CustomBaseModel):
    product_url: str
    image_urls: list[str]

class ListProduct(ListBase):
    product_url: str

class ListProducts(ListBase):
    product_urls: Optional[list[str]]

### RESPONSE MODELS ###

class UserProduct(ProductBase):
    company: str
    liked: bool
    images: list[str]

class UserProduct2(ProductBase):
    company: str
    liked: bool
    images: list[str]

class UserExtended(UserBase):
    favorites: list[str]
    likes: list[str]

class UserLiked(ProductBase):
    liked: bool
    images: list[str]

class UserHistory(ProductBase):
    liked: bool
    images: list[str]

class UserPurchased(ProductBase):
    liked: bool
    purchased: bool
    images: list[str]

class ProductExtended(ProductBase):
    images: list[str]

class UserSchema(BaseModel):
    id: str

class WebsiteExtended(WebsiteBase):
    is_favorite: bool

class UserCompany(CompanyBase):
    favorited: bool
    domains: list[str]

class UserBrand(CustomBaseModel):
    brand: str