import logging
from typing import Optional
from fastapi import APIRouter

from app.crud import websites as crud
from app.models.pydantic import WebsiteUserSchema


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[WebsiteUserSchema])
async def read_all_websites(user_id: Optional[str] = None) -> list[WebsiteUserSchema]:
    return await crud.get_all(user_id)