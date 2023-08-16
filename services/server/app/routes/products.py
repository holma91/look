import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user, FirebaseUser
from app.db import get_db_session
from app.database import product_db
from app.pydantic.requests import ProductRequest, ProductImagesRequest, LikeProductsRequest
from app.pydantic.responses import ProductResponse, BaseResponse

router = APIRouter()

log = logging.getLogger("uvicorn")



@router.get("/", response_model=list[ProductResponse])
async def read_all_products(user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)) -> list[ProductResponse]:
    return product_db.read_all_products(user, session)


@router.post("/", status_code=201, response_model=BaseResponse)
async def add_product(product: ProductRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.add_product(product, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result['detail'])
    

@router.post("/images", status_code=201, response_model=BaseResponse)
def add_product_images(product_images: ProductImagesRequest, _: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.add_product_images(product_images, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result['detail'])
    
@router.delete("/images", status_code=204, response_model=BaseResponse)
def delete_product_images(product_images: ProductImagesRequest, _: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.delete_product_images(product_images, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result['detail'])
    
@router.post("/likes", status_code=200, response_model=BaseResponse)
async def like_products(like_products: LikeProductsRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.like_products(like_products, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result['detail'])


@router.delete("/likes", status_code=204, response_model=BaseResponse)
async def unlike_products(like_products: LikeProductsRequest, user: FirebaseUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    result = product_db.unlike_products(like_products, user.uid, session)
    if not result['success']:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result['detail'])