from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

from app.models.user import User

UserBase = declarative_base()


class UserModel(UserBase):
    __tablename__ = "user"

    id = Column(String, primary_key=True, index=True)


### then a bunch of crud functions


def save(session, user):
    user_model = UserModel(id=user.id)
    session.merge(user_model) # create or update
    session.commit()

    return user

def list_all(session):
    records = session.query(UserModel).all()

    return [User(id=record.id) for record in records]

def get_by_id(session, id):
    record = (
        session.query(UserModel)
        .filter(UserModel.id == id)
        .first()
    )

    return User(id=record.id) if record else None