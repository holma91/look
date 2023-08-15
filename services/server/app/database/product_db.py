from app.auth import FirebaseUser
from app.pydantic.models import Product
from app.database.models import ProductModel, user_product_association

def list_all(user: FirebaseUser, session):
    records = (
        session.query(ProductModel)
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
        updated_at=record.updated_at
    ) for record in records]
