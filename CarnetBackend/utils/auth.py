from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models import User
from dotenv import load_dotenv 
import os

load_dotenv() 

              

oauth2_scheme = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_default_key") 
ALGORITHM = os.getenv("ALGORITHM", "HS256")   


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY,
                             algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is not None:
            user_id = int(user_id)  # Convertir en entier si c’est une chaîne

        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    print(user)
    if user is None:
        raise credentials_exception

    return user
