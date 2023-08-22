from sqlalchemy import (
    String,
    Column,
    ForeignKey,
    Table,
    Boolean,
    Float,
    ForeignKeyConstraint,
)
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

list_product_association = Table(
    "list_product",
    Base.metadata,
    Column("list_id", String),
    Column("user_id", String),
    Column("product_url", String, ForeignKey("product.url")),
    ForeignKeyConstraint(["list_id", "user_id"], ["p_list.id", "p_list.user_id"]),
)

list_company_association = Table(
    "list_company",
    Base.metadata,
    Column("list_id", String),
    Column("user_id", String),
    Column("company_id", String, ForeignKey("company.id")),
    ForeignKeyConstraint(["list_id", "user_id"], ["c_list.id", "c_list.user_id"]),
)


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)

    products: Mapped[list["ProductModel"]] = relationship(
        "ProductModel", secondary=user_product_association, back_populates="users"
    )

    p_lists: Mapped[list["PListModel"]] = relationship(
        "PListModel",
        back_populates="user",
        primaryjoin="and_(UserModel.id==PListModel.user_id)",
    )

    c_lists: Mapped[list["CListModel"]] = relationship(
        "CListModel",
        back_populates="user",
        primaryjoin="and_(UserModel.id==CListModel.user_id)",
    )


class ProductModel(Base):
    __tablename__ = "product"

    url: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    schema_url: Mapped[str] = mapped_column(String)
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
    p_lists: Mapped[list["PListModel"]] = relationship(
        "PListModel", secondary=list_product_association, back_populates="products"
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


class PListModel(Base):
    __tablename__ = "p_list"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("user.id"), primary_key=True
    )

    user: Mapped[UserModel] = relationship("UserModel", back_populates="p_lists")
    products: Mapped[list[ProductModel]] = relationship(
        "ProductModel", secondary=list_product_association, back_populates="p_lists"
    )


class CompanyModel(Base):
    __tablename__ = "company"

    id: Mapped[str] = mapped_column(String, primary_key=True)

    websites: Mapped[list["WebsiteModel"]] = relationship(
        "WebsiteModel", back_populates="company"
    )

    c_lists: Mapped[list["CListModel"]] = relationship(
        "CListModel", secondary=list_company_association, back_populates="companies"
    )


class CListModel(Base):
    __tablename__ = "c_list"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("user.id"), primary_key=True
    )

    user: Mapped[UserModel] = relationship("UserModel", back_populates="c_lists")
    companies: Mapped[list[CompanyModel]] = relationship(
        "CompanyModel", secondary=list_company_association, back_populates="c_lists"
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
