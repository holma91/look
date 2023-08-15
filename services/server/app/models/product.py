import datetime

from sqlalchemy import DateTime, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel

from app.models.base import Base

class ProductModel(BaseModel):
    url: str
    domain: str
    brand: str
    name: str
    currency: str
    price: float
    updated_at: datetime.datetime

class ProductDBModel(Base):
    __tablename__ = "product"

    url: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    domain: Mapped[str] = mapped_column(String)
    brand: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime)    

def list_all(session):
    records = session.query(ProductDBModel).all()

    return [ProductModel(
        url=record.url,
        domain=record.domain,
        brand=record.brand,
        name=record.name,
        currency=record.currency,
        price=record.price,
        updated_at=record.updated_at
    ) for record in records]
