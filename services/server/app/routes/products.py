import logging
from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session
from app.auth import get_current_user, FirebaseUser
from app.db import get_db_session
from app.database import product_db
from app.pydantic.requests import ProductRequest, ProductImagesRequest, LikeProductsRequest
from app.pydantic.responses import ProductResponse

router = APIRouter()

log = logging.getLogger("uvicorn")



@router.get("/", response_model=list[ProductResponse])
async def read_all_products(user: FirebaseUser = Depends(get_current_user), session = Depends(get_db_session)) -> list[ProductResponse]:
    return product_db.read_all_products(user, session)


@router.post("/", status_code=201)
async def add_product(product: ProductRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.add_product(product, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    

@router.post("/images", status_code=201)
def add_product_images(product_images: ProductImagesRequest, _: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.add_product_images(product_images, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    
@router.delete("/images", status_code=204)
def delete_product_images(product_images: ProductImagesRequest, _: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.delete_product_images(product_images, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    
@router.post("/likes", status_code=200)
async def like_products(like_products: LikeProductsRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.like_products(like_products, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])

@router.delete("/likes", status_code=204)
async def unlike_products(like_products: LikeProductsRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.unlike_products(like_products, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])