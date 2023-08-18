from sqlalchemy import insert, and_
from sqlalchemy.orm import joinedload

from app.pydantic.responses import CompanyResponse, CListResponse
from app.database.models import CompanyModel, CListModel, list_company_association

### COMPANIES ###


def get_companies(session):
    records = (
        session.query(CompanyModel).options(joinedload(CompanyModel.websites)).all()
    )

    return [
        CompanyResponse(
            id=record.id,
            domains=[website.domain for website in record.websites],
        )
        for record in records
    ]


### LISTS ###


def get_lists(user, session):
    records = session.query(CListModel).filter(CListModel.user_id == user.uid).all()

    return [CListResponse(id=record.id) for record in records]


def create_list(request, user, session):
    new_list = CListModel(id=request.id, user_id=user.uid)

    session.add(new_list)
    session.flush()

    associations = [
        {"list_id": request.id, "user_id": user.uid, "company_id": company_id}
        for company_id in request.company_ids
    ]
    if associations:
        session.execute(insert(list_company_association).values(associations))

    session.commit()
    return {"success": True, "detail": "List created successfully."}


# def get_list(list_id, user, session):
#     records = session.query(list_company_association.c.company_id).filter(
#         and_(list_company_association.c.list_id == list_id, list_company_association.c.user_id == user.uid)
#     )


def get_list(list_id, user, session):
    # Fetch the specific list for the user
    c_list = session.query(CListModel).filter_by(id=list_id, user_id=user.uid).first()

    # Return the companies associated with the list
    if c_list:
        return [company.id for company in c_list.companies]
    return []
