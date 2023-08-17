from sqlalchemy.orm import joinedload

from app.pydantic.responses import CompanyResponse
from app.database.models import CompanyModel


def get_companies(session):
    records = (
        session.query(CompanyModel).options(joinedload(CompanyModel.websites)).all()
    )

    return [
        CompanyResponse(
            id=record.id,
            websites=[website.domain for website in record.websites],
        )
        for record in records
    ]
