from sqlalchemy import Column, DateTime, String, Float
from sqlalchemy.ext.declarative import declarative_base

from app.models.product import Product

ProductBase = declarative_base()


class ProductModel(ProductBase):
    __tablename__ = "product"

    url = Column(String, primary_key=True, index=True)
    domain = Column(String)
    brand = Column(String)
    name = Column(String)
    currency = Column(String)
    price = Column(Float)
    updated_at = Column(DateTime)


def list_all(session):
    records = session.query(ProductModel).all()

    return [Product(
        url=record.url,
        domain=record.domain,
        brand=record.brand,
        name=record.name,
        currency=record.currency,
        price=record.price,
        updated_at=record.updated_at
    ) for record in records]
