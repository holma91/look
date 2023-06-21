from pydantic import BaseModel


class UserPayloadSchema(BaseModel):
    id: str


class UserResponseSchema(UserPayloadSchema):
    id: str