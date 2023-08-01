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

class POSTResponse(BaseModel):
    status: str
    message: str

class POSTResponseAddImage(BaseModel):
    success: bool
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

class CompanyBase(BaseModel):
    id: str

class ListBase(CustomBaseModel):
    id: str

### REQUEST MODELS ###

class LikeProduct(BaseModel):
    product_url: str

class FavoriteWebsite(BaseModel):
    domain: str

class FavoriteCompany(BaseModel):
    id: str

class ProductImage(BaseModel):
    product_url: str
    image_url: str

class ListProduct(BaseModel):
    list_id: str
    product_url: str

class ListWithProducts(ListBase):
    product_urls: Optional[list[str]]

### RESPONSE MODELS ###

class UserProduct(ProductBase):
    company: str
    liked: bool
    # purchased: bool
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
