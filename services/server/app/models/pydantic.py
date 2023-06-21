from pydantic import BaseModel

# These are the Pydantic models that we use for validation

class SummaryPayloadSchema(BaseModel):
    url: str


class SummaryResponseSchema(SummaryPayloadSchema):
    id: int


############### LOOK ###############

class UserPayloadSchema(BaseModel):
    user_id: str


class UserResponseSchema(UserPayloadSchema):
    id: int