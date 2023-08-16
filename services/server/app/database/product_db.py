from sqlalchemy.orm import joinedload, Session

from app.auth import FirebaseUser
from app.pydantic.models import Product
from app.database.models import ProductModel, user_product_association, ProductImageModel, UserModel

def list_all(user: FirebaseUser, session: Session):
    records = (
        session.query(ProductModel)
        .options(joinedload(ProductModel.images))
        .join(user_product_association)
        .filter(user_product_association.c.user_id == user.uid)
        .all()
    )

    return [Product(
        url=record.url,
        domain=record.domain,
        brand=record.brand,
        name=record.name,
        currency=record.currency,
        price=record.price,
        updated_at=record.updated_at,
        images=[img.image_url for img in record.images]
    ) for record in records]


def add_product(product: Product, user_uid: str, session: Session) -> Product:

    new_product = ProductModel(
        url=product.url, 
        domain=product.domain, 
        brand=product.brand, 
        name=product.name, 
        price=product.price, 
        currency=product.currency,
        images=[ProductImageModel(image_url=image.image_url) for image in product.images]
    )
    session.add(new_product)
  
    user = session.query(UserModel).filter_by(id=user_uid).one()
    user.products.append(new_product)

    session.commit()

    return Product.from_orm(new_product)




