from sqlalchemy import and_
from sqlalchemy.orm import joinedload, Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, or_

from app.auth import FirebaseUser
from app.pydantic.requests import (
    GetProductRequest,
    ProductRequest,
    ProductImagesRequest,
    LikeProductsRequest,
)
from app.pydantic.responses import ProductResponse
from app.database.models import (
    ProductModel,
    user_product_association,
    ProductImageModel,
    UserModel,
)


def get_product(product_url: str, user: FirebaseUser, session: Session) -> dict:
    # Querying both ProductModel and liked column
    record = (
        session.query(ProductModel, user_product_association.c.liked)
        .options(joinedload(ProductModel.images))
        .join(
            user_product_association,
            user_product_association.c.product_url == ProductModel.url,
        )
        .filter(ProductModel.url == product_url)
        .filter(user_product_association.c.user_id == user.uid)
        .first()
    )

    if not record:
        return {"success": False, "detail": "Product not found!"}

    # Extracting both the ProductModel instance and liked status from the tuple
    product, liked_status = record

    product_response = ProductResponse(
        url=product.url,
        domain=product.domain,
        brand=product.brand,
        name=product.name,
        currency=product.currency,
        price=product.price,
        liked=liked_status,  # Use the fetched liked status here
        images=[img.image_url for img in product.images],
    )

    return {
        "success": True,
        "detail": "Product retrieved successfully!",
        "data": product_response,
    }


def get_products(
    filters: dict, user: FirebaseUser, session: Session
) -> list[ProductResponse]:
    base_query = (
        session.query(ProductModel, user_product_association.c.liked)
        .options(joinedload(ProductModel.images))
        .join(
            user_product_association,
            user_product_association.c.product_url == ProductModel.url,
        )
        # .join(WebsiteModel, WebsiteModel.domain == ProductModel.domain)
        .filter(user_product_association.c.user_id == user.uid)
    )

    # Apply filters based on the provided filters dictionary
    if filters:
        if filters.get("list") == "likes":
            base_query = base_query.filter(user_product_association.c.liked == True)

        if filters.get("brand"):
            base_query = base_query.filter(ProductModel.brand.in_(filters["brand"]))

        # if filters.get("website"):
        # base_query = base_query.filter(WebsiteModel.domain.in_(filters["website"]))

    records = base_query.all()

    return [
        ProductResponse(
            url=record.ProductModel.url,
            domain=record.ProductModel.domain,
            brand=record.ProductModel.brand,
            name=record.ProductModel.name,
            currency=record.ProductModel.currency,
            price=record.ProductModel.price,
            liked=record.liked,
            images=[img.image_url for img in record.ProductModel.images],
        )
        for record in records
    ]


def add_product(product: ProductRequest, user_uid: str, session: Session):
    try:
        new_product = ProductModel(
            url=product.url,
            domain=product.domain,
            brand=product.brand,
            name=product.name,
            price=product.price,
            currency=product.currency,
            images=[ProductImageModel(image_url=image) for image in product.images],
        )
        session.add(new_product)

        user = session.query(UserModel).filter_by(id=user_uid).one()
        user.products.append(new_product)

        session.commit()
        return {"success": True, "detail": "Product added successfully!"}
    except IntegrityError:
        return {"success": False, "detail": "Product already exists!"}


def add_product_images(product_images: ProductImagesRequest, session: Session):
    try:
        for image_url in product_images.image_urls:
            new_image = ProductImageModel(
                product_url=product_images.product_url, image_url=image_url
            )
            session.add(new_image)

        session.commit()
        return {"success": True, "detail": "Images added successfully"}
    except IntegrityError:
        return {"success": False, "detail": "Duplicate images or product URL not found"}


def delete_product_images(product_images: ProductImagesRequest, session: Session):
    try:
        images_to_delete = (
            session.query(ProductImageModel)
            .filter(ProductImageModel.product_url == product_images.product_url)
            .filter(ProductImageModel.image_url.in_(product_images.image_urls))
        )

        images_to_delete.delete(synchronize_session="fetch")

        session.commit()
        return {"success": True, "detail": "Images deleted successfully"}
    except IntegrityError:
        return {"success": False, "detail": "Product URL or images URLs not found"}


def like_products(like_products: LikeProductsRequest, user_uid: str, session: Session):
    try:
        for product_url in like_products.product_urls:
            session.query(user_product_association).filter(
                and_(
                    user_product_association.c.user_id == user_uid,
                    user_product_association.c.product_url == product_url,
                )
            ).update({user_product_association.c.liked: True})

        session.commit()
        return {"success": True, "detail": "Products liked successfully!"}

    except IntegrityError:
        return {"success": False, "detail": "Error liking product!"}


def unlike_products(
    unlike_products: LikeProductsRequest, user_uid: str, session: Session
):
    try:
        for product_url in unlike_products.product_urls:
            session.query(user_product_association).filter(
                and_(
                    user_product_association.c.user_id == user_uid,
                    user_product_association.c.product_url == product_url,
                )
            ).update({user_product_association.c.liked: False})

        session.commit()
        return {"success": True, "detail": "Products unliked successfully!"}

    except IntegrityError:
        return {"success": False, "detail": "Error unliking product!"}
