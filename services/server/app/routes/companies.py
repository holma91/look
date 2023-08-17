import logging
from fastapi import APIRouter, Depends

from app.database import company_db
from app.db import get_db_session

# from app.models.pydantic import CompanyBase
from app.pydantic.models import Company
from app.pydantic.responses import CompanyResponse


router = APIRouter()

log = logging.getLogger("uvicorn")


@router.get("", response_model=list[CompanyResponse])
async def read_all_companies(session=Depends(get_db_session)):
    return company_db.get_companies(session)
