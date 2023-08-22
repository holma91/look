from app.pydantic.models import CustomBaseModel


class BaseResponse(CustomBaseModel):
    detail: str


class ProductResponse(CustomBaseModel):
    url: str
    schema_url: str
    domain: str
    brand: str
    name: str
    price: float
    currency: str
    images: list[str]

    liked: bool


class CompanyResponse(CustomBaseModel):
    id: str
    domains: list[str]
    favorited: bool


class PListResponse(CustomBaseModel):
    id: str


class CListResponse(CustomBaseModel):
    id: str
    # companies: list[CompanyResponse]
