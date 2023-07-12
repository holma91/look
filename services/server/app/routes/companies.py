import logging
from typing import Optional
from fastapi import APIRouter

from app.crud import companies as crud
from app.models.pydantic import CompanyBase


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[CompanyBase])
async def read_all_companies() -> list[CompanyBase]:
    return await crud.get_all()