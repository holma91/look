
from app.pydantic.models import Company  # Assuming you have a Pydantic model for Company
from app.database.models import CompanyModel


def list_all(session):
    records = session.query(CompanyModel).all()

    return [Company(
        id=record.id,
    ) for record in records]
