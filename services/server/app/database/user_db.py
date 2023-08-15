
from app.pydantic.models import User
from app.database.models import UserModel

def list_all(session):
    records = session.query(UserModel).all()

    return [User(id=record.id) for record in records]

def get_by_id(session, id):
    record = (
        session.query(UserModel)
        .filter(User.id == id)
        .first()
    )

    return User(id=record.id) if record else None