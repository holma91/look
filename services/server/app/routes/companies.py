import logging

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Query

from app.crud import companies_db
from app.auth import get_current_user, FirebaseUser
from app.database.db import get_db_session

from app.pydantic.responses import CompanyResponse, CListResponse, BaseResponse
from app.pydantic.requests import CListCreateRequest, CListAddCompaniesRequest


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("", response_model=list[CompanyResponse])
async def get_companies(
    clist: str = Query(None),
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return companies_db.get_companies(clist, user, session)


@router.get("/lists", response_model=list[CListResponse])
async def get_lists(
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return companies_db.get_lists(user, session)


@router.post("/lists", status_code=200, response_model=BaseResponse)
async def create_list(
    request: CListCreateRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = companies_db.create_list(request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=409, detail=result["detail"])

    return BaseResponse(detail=result["detail"])


@router.get("/lists/{list_id}", response_model=list[str])
async def get_list(
    list_id: str,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return companies_db.get_list(list_id, user, session)


@router.post("/lists/{list_id}", response_model=BaseResponse)
async def add_to_list(
    list_id: str,
    request: CListAddCompaniesRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = companies_db.add_to_list(list_id, request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["detail"])

    return result


@router.delete("/lists/{list_id}", response_model=BaseResponse)
async def delete_from_list(
    list_id: str,
    request: CListAddCompaniesRequest,
    user: FirebaseUser = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    result = companies_db.delete_from_list(list_id, request, user, session)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["detail"])

    return result
