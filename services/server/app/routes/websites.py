import logging
from typing import Optional
from fastapi import APIRouter

from app.crud import websites as crud
from app.models.pydantic import WebsiteExtended


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[WebsiteExtended])
async def read_all_websites(user_id: Optional[str] = None) -> list[WebsiteExtended]:
    return await crud.get_all(user_id)