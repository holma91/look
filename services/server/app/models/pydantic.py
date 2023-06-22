from pydantic import BaseModel


class UserPayloadSchema(BaseModel):
    id: str


class UserResponseSchema(UserPayloadSchema):
    id: str


class WebsiteUserSchema(BaseModel):
    domain: str
    multi_brand: bool
    second_hand: bool
    is_favorite: bool
