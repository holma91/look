from app.pydantic.models import CustomBaseModel


class GetProductRequest(CustomBaseModel):
    product_url: str


class ProductRequest(CustomBaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: list[str]


class ProductImagesRequest(CustomBaseModel):
    product_url: str
    image_urls: list[str]


class LikeProductsRequest(CustomBaseModel):
    product_urls: list[str]
