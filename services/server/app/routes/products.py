import logging
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user, FirebaseUser
from app.db import get_db_session
from app.database import product_db
from app.pydantic.requests import (
    ProductRequest,
    ProductImagesRequest,
    LikeProductsRequest,
    PListCreateRequest,
    PListDeleteRequest,
    PListAddProductRequest,
)
from app.pydantic.responses import (
    ProductResponse,
    BaseResponse,
    PListResponse,
    CompanyResponse,
)

router = APIRouter()

log = logging.getLogger("uvicorn")

# get, add, delete


@router.get("", response_model=list[ProductResponse])
async def get_products(
    list: str = "likes",
    brand: list[str] = Query(None),
    website: list[str] = Query(None),
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
) -> list[ProductResponse]:
    filters = {"list": list, "brand": brand, "website": website}
    return product_db.get_products(filters, user, session)


@router.post("", status_code=201, response_model=BaseResponse)
async def add_product(
    product: ProductRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.add_product(product, user.uid, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])
    return BaseResponse(detail=result["detail"])


@router.get("/product", response_model=ProductResponse)
async def get_product(
    product_url: str = Query(..., description="URL of the product to retrieve"),
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
) -> ProductResponse:
    product = product_db.get_product(product_url, user, session)
    if not product["success"]:
        raise HTTPException(status_code=404, detail=product["detail"])

    return product["data"]


@router.post("/images", status_code=201, response_model=BaseResponse)
def add_product_images(
    product_images: ProductImagesRequest,
    _: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.add_product_images(product_images, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])
    return BaseResponse(detail=result["detail"])


@router.delete("/images", status_code=204)
def delete_product_images(
    product_images: ProductImagesRequest,
    _: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    print("delete_product_images: ", product_images)
    result = product_db.delete_product_images(product_images, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])


@router.post("/likes", status_code=200, response_model=BaseResponse)
async def like_products(
    like_products: LikeProductsRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.like_products(like_products, user.uid, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["message"])
    return BaseResponse(detail=result["detail"])


@router.delete("/likes", status_code=204)
async def unlike_products(
    like_products: LikeProductsRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.unlike_products(like_products, user.uid, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["message"])


### PLISTS ###


@router.get("/lists", response_model=list[PListResponse])
async def get_lists(
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return product_db.get_lists(user, session)


@router.post("/lists", status_code=200, response_model=BaseResponse)
async def create_list(
    request: PListCreateRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.create_list(request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])

    return BaseResponse(detail=result["detail"])


@router.delete("/lists", status_code=204)
async def delete_list(
    request: PListDeleteRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.delete_list(request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["message"])


@router.post("/lists/{list_id}", status_code=200, response_model=BaseResponse)
async def add_to_list(
    list_id: str,
    request: PListAddProductRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.add_to_list(list_id, request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])

    return BaseResponse(detail=result["detail"])


@router.delete("/lists/{list_id}", status_code=204)
async def delete_from_list(
    list_id: str,
    request: PListAddProductRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = product_db.delete_from_list(list_id, request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])


### MISC ###


@router.get("/brands", response_model=list[str])
async def get_brands(
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return product_db.get_brands(user, session)


@router.get("/companies", response_model=list[CompanyResponse])
async def get_companies(
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return product_db.get_companies(user, session)
