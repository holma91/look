from pydantic import BaseModel


class UserSchema(BaseModel):
    id: str

class WebsiteSchema(BaseModel):
    domain: str
    multi_brand: bool
    second_hand: bool

class WebsiteUserSchema(WebsiteSchema):
    is_favorite: bool