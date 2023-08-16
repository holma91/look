from sqlalchemy import String, Column, ForeignKey, Table, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase


class Base(DeclarativeBase):
    pass


user_product_association = Table(
    "user_product",
    Base.metadata,
    Column("user_id", String, ForeignKey("user.id")),
    Column("product_url", String, ForeignKey("product.url")),
    Column("liked", Boolean),
)


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)

    products: Mapped[list["ProductModel"]] = relationship(
        "ProductModel", secondary=user_product_association, back_populates="users"
    )


class ProductModel(Base):
    __tablename__ = "product"

    url: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    domain: Mapped[str] = mapped_column(String, ForeignKey("website.domain"))
    brand: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    currency: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)

    images: Mapped[list["ProductImageModel"]] = relationship(
        "ProductImageModel", back_populates="product"
    )
    website: Mapped["WebsiteModel"] = relationship(
        "WebsiteModel", back_populates="products"
    )
    users: Mapped[list["UserModel"]] = relationship(
        "UserModel", secondary=user_product_association, back_populates="products"
    )


class ProductImageModel(Base):
    __tablename__ = "product_image"

    product_url: Mapped[str] = mapped_column(
        String, ForeignKey("product.url"), primary_key=True
    )
    image_url: Mapped[str] = mapped_column(String, primary_key=True)

    product: Mapped["ProductModel"] = relationship(
        "ProductModel", back_populates="images"
    )


class CompanyModel(Base):
    __tablename__ = "company"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    websites: Mapped[list["WebsiteModel"]] = relationship(
        "WebsiteModel", back_populates="company"
    )


class WebsiteModel(Base):
    __tablename__ = "website"

    domain: Mapped[str] = mapped_column(String, primary_key=True)
    company_id: Mapped[str] = mapped_column(String, ForeignKey("company.id"))

    company: Mapped["CompanyModel"] = relationship(
        "CompanyModel", back_populates="websites"
    )
    products: Mapped[list[ProductModel]] = relationship(
        "ProductModel", back_populates="website"
    )
