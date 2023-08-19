from sqlalchemy import insert, and_
from sqlalchemy.orm import joinedload
from sqlalchemy.dialects.postgresql import insert as pg_insert

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
    records = (
        session.query(CListModel)
        .options(joinedload(CListModel.companies).joinedload(CompanyModel.websites))
        .filter(CListModel.user_id == user.uid)
        .all()
    )

    return [
        CListResponse(
            id=record.id,
            companies=[
                CompanyResponse(
                    id=company.id,
                    domains=[website.domain for website in company.websites],
                )
                for company in record.companies
            ],
        )
        for record in records
    ]


# def get_lists(user, session):
#     records = session.query(CListModel).filter(CListModel.user_id == user.uid).all()

#     return [CListResponse(id=record.id) for record in records]


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
    c_list = session.query(CListModel).filter_by(id=list_id, user_id=user.uid).first()

    if not c_list:
        return {"success": False, "detail": "List not found."}

    return [company.id for company in c_list.companies]


def add_to_list(list_id, request, user, session):
    c_list = session.query(CListModel).filter_by(id=list_id, user_id=user.uid).first()

    if not c_list:
        return {"success": False, "detail": "List not found."}

    # Prepare associations for bulk insert
    associations = [
        {"list_id": list_id, "user_id": user.uid, "company_id": company_id}
        for company_id in request.company_ids
    ]

    insert_stmt = (
        pg_insert(list_company_association)
        .values(associations)
        .on_conflict_do_nothing(index_elements=["list_id", "user_id", "company_id"])
    )
    session.execute(insert_stmt)

    session.commit()
    return {"success": True, "detail": "Companies added to list successfully!"}


def delete_from_list(list_id, request, user, session):
    user_list = (
        session.query(CListModel).filter_by(id=list_id, user_id=user.uid).first()
    )

    if not user_list:
        return {"success": False, "detail": "List not found."}

    # Bulk delete associations
    session.query(list_company_association).filter(
        list_company_association.c.list_id == list_id,
        list_company_association.c.user_id == user.uid,
        list_company_association.c.company_id.in_(request.company_ids),
    ).delete(synchronize_session="fetch")

    session.commit()
    return {"success": True, "detail": "Companies removed from list successfully!"}
