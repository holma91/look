from app.pydantic.models import CustomBaseModel


class BaseResponse(CustomBaseModel):
    detail: str


class ProductResponse(CustomBaseModel):
    url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: list[str]

    liked: bool


class CompanyResponse(CustomBaseModel):
    id: str
    websites: list[str]


class PListResponse(CustomBaseModel):
    id: str
