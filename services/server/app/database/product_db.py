from sqlalchemy import and_
from sqlalchemy.orm import joinedload, Session
from sqlalchemy.exc import IntegrityError

from app.auth import FirebaseUser
from app.pydantic.requests import ProductRequest, ProductImagesRequest, LikeProductsRequest
from app.pydantic.responses import ProductResponse
from app.database.models import ProductModel, user_product_association, ProductImageModel, UserModel

def read_all_products(user: FirebaseUser, session: Session):
    records = (
        session.query(ProductModel)
        .options(joinedload(ProductModel.images))
        .join(user_product_association)
        .filter(user_product_association.c.user_id == user.uid)
        .all()
    )

    return [ProductResponse(
        url=record.url,
        domain=record.domain,
        brand=record.brand,
        name=record.name,
        currency=record.currency,
        price=record.price,
        images=[img.image_url for img in record.images]
    ) for record in records]


def add_product(product: ProductRequest, user_uid: str, session: Session):
    try:
      new_product = ProductModel(
          url=product.url, 
          domain=product.domain, 
          brand=product.brand, 
          name=product.name, 
          price=product.price, 
          currency=product.currency,
          images=[ProductImageModel(image_url=image) for image in product.images]
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
          new_image = ProductImageModel(product_url=product_images.product_url, image_url=image_url)
          session.add(new_image)
    
      session.commit()
      return {"success": True, "detail": "Images added successfully"}
    except IntegrityError: 
      return {"success": False, "detail": "Duplicate images or product URL not found"}


def delete_product_images(product_images: ProductImagesRequest, session: Session):
    try:
      images_to_delete = session.query(ProductImageModel) \
                          .filter(ProductImageModel.product_url == product_images.product_url) \
                          .filter(ProductImageModel.image_url.in_(product_images.image_urls))
      
      images_to_delete.delete(synchronize_session='fetch')
      
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
                    user_product_association.c.product_url == product_url
                )
            ).update({user_product_association.c.liked: True})


        session.commit()
        return {"success": True, "detail": "Products liked successfully!"}

    except IntegrityError:
        return {"success": False, "detail": "Error liking product!"}

def unlike_products(unlike_products: LikeProductsRequest, user_uid: str, session: Session):
    try:
        for product_url in unlike_products.product_urls:
            session.query(user_product_association).filter(
                and_(
                    user_product_association.c.user_id == user_uid,
                    user_product_association.c.product_url == product_url
                )
            ).update({user_product_association.c.liked: False})


        session.commit()
        return {"success": True, "detail": "Products unliked successfully!"}

    except IntegrityError:
        return {"success": False, "detail": "Error unliking product!"}