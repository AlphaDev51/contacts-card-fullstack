from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

import schemas
import models
from database import SessionLocal, get_db


# Assure-toi que tu as bien cette fonction
from utils.auth import get_current_user
from models import User

from datetime import datetime, timedelta
from jose import JWTError, jwt


from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_default_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

router = APIRouter()

# 1. Config bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Fonction pour hasher le password


def hash_password(password: str):
    return pwd_context.hash(password)

# 3. Fonction pour vérifier


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 4. Dépendance pour avoir une DB session (plutôt que recréer partout)


# Utilise ton UserOut qui inclut 'name'
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    # get_current_user vérifie le JWT et retourne l'utilisateur
    # Comme UserOut correspond à ton modèle User, SQLAlchemy le convertit automatiquement
    return current_user


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Vérifier si l'email existe déjà
    existing_user = db.query(models.User).filter(
        models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    # Vérifier la longueur du mot de passe AVANT de hasher
    if len(user.password) > 72:
        raise HTTPException(
            status_code=400,
            detail="Mot de passe trop long (max 72 caractères)"
        )

    # Hasher mot de passe
    hashed_pw = hash_password(user.password)

    # Créer utilisateur
    new_user = models.User(
        name=user.name, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Email invalide ❌")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect ❌")

    # ✅ Ici, on envoie l'id de l'utilisateur dans le token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        # ✅ user_id au lieu de sub
        data={"user_id": db_user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
