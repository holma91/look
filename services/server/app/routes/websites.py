import logging
from typing import Optional
from fastapi import APIRouter

from app.crud import websites as crud
from app.models.pydantic import WebsiteExtended, WebsiteBase


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[WebsiteBase])
async def read_all_websites() -> list[WebsiteBase]:
    return await crud.get_all()

@router.get("/{company_id}", response_model=list[WebsiteBase])
async def read_all_websites_by_company(company_id: str) -> list[WebsiteBase]:
    return await crud.get_by_company(company_id)