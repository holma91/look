import logging
from fastapi import APIRouter, Depends

from app.database import company_db
from app.db import get_db_session
# from app.models.pydantic import CompanyBase
from app.pydantic.models import Company


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("/", response_model=list[Company])
async def read_all_companies(session = Depends(get_db_session)) -> list[Company]:
    return company_db.list_all(session)