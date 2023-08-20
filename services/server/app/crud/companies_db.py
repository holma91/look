from sqlalchemy import insert, and_
from sqlalchemy.orm import joinedload, Session
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.auth import FirebaseUser
from app.pydantic.responses import CompanyResponse, CListResponse
from app.database.models import CompanyModel, CListModel, list_company_association

### COMPANIES ###


def get_companies(clist: str, user: FirebaseUser, session: Session):
    query = (
        session.query(CompanyModel)
        .options(joinedload(CompanyModel.websites))
        .order_by(CompanyModel.id)
    )

    if not clist == "all":
        query = (
            query.join(
                list_company_association,
                CompanyModel.id == list_company_association.c.company_id,
            )
            .join(
                CListModel,
                and_(
                    CListModel.id == list_company_association.c.list_id,
                    CListModel.user_id == list_company_association.c.user_id,
                ),
            )
            .filter(CListModel.id == clist)
        )

    records = query.all()

    # get favorites
    favorite_list = (
        session.query(CListModel)
        .filter(CListModel.user_id == user.uid, CListModel.id == "favorites")
        .first()
    )

    favorite_companies = []
    if favorite_list:
        favorite_companies = [company.id for company in favorite_list.companies]

    return [
        CompanyResponse(
            id=record.id,
            domains=[website.domain for website in record.websites],
            favorited=record.id in favorite_companies,
        )
        for record in records
    ]


### LISTS ###


def get_lists(user: FirebaseUser, session: Session):
    records = (
        session.query(CListModel)
        .options(joinedload(CListModel.companies).joinedload(CompanyModel.websites))
        .filter(CListModel.user_id == user.uid)
        .all()
    )

    return [
        CListResponse(
            id=record.id,
        )
        for record in records
    ]


def create_list(request, user: FirebaseUser, session: Session):
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


def get_list(list_id, user: FirebaseUser, session: Session):
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


def delete_from_list(list_id, request, user: FirebaseUser, session: Session):
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
