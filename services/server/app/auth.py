from fastapi import Depends, HTTPException, status, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
from pydantic import BaseModel


class FirebaseUser(BaseModel):
    name: str
    picture: str
    iss: str
    aud: str
    auth_time: int
    user_id: str
    sub: str
    iat: int
    exp: int
    email: str
    email_verified: bool
    firebase: dict
    uid: str


credential = credentials.Certificate("./key.json")
initialize_app(credential)


def get_current_user(
    res: Response,
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer authentication is needed",
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )
    try:
        user = auth.verify_id_token(token.credentials)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication from Firebase. {err}",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )
    res.headers["WWW-Authenticate"] = 'Bearer realm="auth_required"'
    return FirebaseUser(**user)
