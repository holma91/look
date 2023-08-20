from sqlalchemy import and_, insert, distinct
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import joinedload, Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_

from app.auth import FirebaseUser
from app.pydantic.requests import (
    ProductRequest,
    ProductImagesRequest,
    LikeProductsRequest,
    PListCreateRequest,
    PListDeleteRequest,
    PListAddProductRequest,
)
from app.pydantic.responses import ProductResponse, PListResponse, CompanyResponse
from app.database.models import (
    ProductModel,
    user_product_association,
    list_product_association,
    ProductImageModel,
    UserModel,
    PListModel,
    CompanyModel,
    WebsiteModel,
)

### PRODUCTS ###


def get_product(product_url: str, user: FirebaseUser, session: Session):
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
        .filter(user_product_association.c.user_id == user.uid)
    )

    list_filter = filters.get("list")
    if list_filter == "history":
        pass
    elif list_filter == "likes":
        base_query = base_query.filter(user_product_association.c.liked == True)
    elif list_filter:
        base_query = base_query.join(
            list_product_association,
            list_product_association.c.product_url == ProductModel.url,
        ).filter(list_product_association.c.list_id == list_filter)

    if filters.get("brand"):
        base_query = base_query.filter(ProductModel.brand.in_(filters["brand"]))

    if filters.get("website"):
        base_query = (
            base_query.join(WebsiteModel)
            .join(CompanyModel)
            .filter(CompanyModel.id.in_(filters["website"]))
        )

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


### LISTS ###


def get_lists(user: FirebaseUser, session: Session):
    records = session.query(PListModel).filter(PListModel.user_id == user.uid).all()

    return [PListResponse(id=record.id) for record in records]


def create_list(request: PListCreateRequest, user: FirebaseUser, session: Session):
    new_list = PListModel(id=request.id, user_id=user.uid)

    session.add(new_list)
    session.flush()

    associations = [
        {"list_id": request.id, "user_id": user.uid, "product_url": url}
        for url in request.product_urls
    ]
    if associations:
        session.execute(insert(list_product_association).values(associations))

    session.commit()

    return {"success": True, "detail": "PList created successfully!"}


def delete_list(request: PListDeleteRequest, user: FirebaseUser, session: Session):
    # First, delete associations to ensure foreign key constraints are not violated
    session.execute(
        list_product_association.delete().where(
            list_product_association.c.list_id == request.id
        )
    )

    # Then, delete the PList
    list_obj = (
        session.query(PListModel)
        .filter(PListModel.id == request.id, PListModel.user_id == user.uid)
        .first()
    )
    if not list_obj:
        return {"success": False, "message": "List not found"}

    session.delete(list_obj)
    session.commit()

    return {"success": True, "detail": "List deleted successfully"}


def add_to_list(
    list_id: str, request: PListAddProductRequest, user: FirebaseUser, session: Session
):
    associations = [
        {"list_id": list_id, "user_id": user.uid, "product_url": url}
        for url in request.product_urls
    ]

    try:
        if associations:
            insert_stmt = (
                pg_insert(list_product_association)
                .values(associations)
                .on_conflict_do_nothing(
                    index_elements=["list_id", "user_id", "product_url"]
                )
            )
            session.execute(insert_stmt)
            session.commit()
        return {"success": True, "detail": "Products added to list successfully!"}
    except IntegrityError:
        return {
            "success": False,
            "detail": "Failed to add products. Ensure the list belongs to you.",
        }


def delete_from_list(
    list_id: str, request: PListAddProductRequest, user: FirebaseUser, session: Session
):
    try:
        session.execute(
            list_product_association.delete().where(
                and_(
                    list_product_association.c.list_id == list_id,
                    list_product_association.c.user_id == user.uid,
                    list_product_association.c.product_url.in_(request.product_urls),
                )
            )
        )
        session.commit()
        return {"success": True, "detail": "Products deleted from list successfully!"}
    except IntegrityError:
        return {
            "success": False,
            "detail": "Failed to delete products. Ensure the list belongs to you.",
        }


### MISC ###


def get_brands(user: FirebaseUser, session: Session):
    brands = (
        session.query(distinct(ProductModel.brand))
        .join(
            user_product_association,
            user_product_association.c.product_url == ProductModel.url,
        )
        .filter(user_product_association.c.user_id == user.uid)
        .all()
    )

    return [brand[0] for brand in brands]


def get_companies(user: FirebaseUser, session: Session):
    records = (
        session.query(CompanyModel)
        .join(WebsiteModel, WebsiteModel.company_id == CompanyModel.id)
        .join(ProductModel, ProductModel.domain == WebsiteModel.domain)
        .join(
            user_product_association,
            user_product_association.c.product_url == ProductModel.url,
        )
        .filter(user_product_association.c.user_id == user.uid)
        .all()
    )

    return [
        CompanyResponse(
            id=record.id,
            domains=[website.domain for website in record.websites],
            favorited=False,  # change
        )
        for record in records
    ]
