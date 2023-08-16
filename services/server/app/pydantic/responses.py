from app.pydantic.models import CustomBaseModel

class ProductResponse(CustomBaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: list[str]