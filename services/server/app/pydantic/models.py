import datetime
from typing import Optional

from humps import camelize
from pydantic import BaseModel


def to_camel(string):
    return camelize(string)

class CustomBaseModel(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True
        orm_mode = True

class User(CustomBaseModel):
    id: str

class Image(CustomBaseModel):
    image_url: str

class Website(CustomBaseModel):
    domain: str

class Company(CustomBaseModel):
    id: str

class Product(CustomBaseModel):
    url: str
    domain: str
    brand: str
    name: str
    currency: str
    price: float

    images: list[Image]



