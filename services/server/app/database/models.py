import datetime

from sqlalchemy import String, Column, ForeignKey, Table, Boolean, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

user_product_association = Table(
    'user_product',
    Base.metadata,
    Column('user_id', String, ForeignKey('user.id')),
    Column('product_url', String, ForeignKey('product.url')),
    Column('liked', Boolean)
)


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)

    products: Mapped[list["ProductModel"]] = relationship("ProductModel", secondary=user_product_association, back_populates="users")

class ProductModel(Base):
    __tablename__ = "product"

    url: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    domain: Mapped[str] = mapped_column(String)
    brand: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime)    

    users: Mapped[list[UserModel]] = relationship("UserModel", 
                                                  secondary=user_product_association,
                                                  back_populates="products")