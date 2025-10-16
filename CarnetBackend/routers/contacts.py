from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
import models
from database import SessionLocal, get_db
from utils.auth import get_current_user  # 👈 Tu as créé ça
from models import User  # 👈 Pour typer current_user
from typing import List  # 👈 Ajoute cette importation en haut

router = APIRouter()


@router.post("/", response_model=schemas.ContactOut)
def create_contact(
    contact: schemas.ContactBase,
    current_user: User = Depends(get_current_user),  # 👈 L'utilisateur connecté
    db: Session = Depends(get_db)
):
    db_contact = models.Contact(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        tag=contact.tag,
        is_favorite=contact.is_favorite,
        owner_id=current_user.id  # 🔐 Lier au user connecté
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    return db_contact


@router.get("/", response_model=List[schemas.ContactOut])
def get_contacts(
    current_user: User = Depends(get_current_user),  # 👈 L'utilisateur connecté
    db: Session = Depends(get_db)
):
    contacts = db.query(models.Contact).filter(
        models.Contact.owner_id == current_user.id).all()
    return contacts


@router.put("/{contact_id}", response_model=schemas.ContactOut)
def Modify_contact(
    contact_id: int,
    contact_update: schemas.ContactBase,  # Ce que le frontend envoie
    current_user: User = Depends(get_current_user),  # 👈 L'utilisateur connecté
    db: Session = Depends(get_db)

):
    db_contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id,
        models.Contact.owner_id == current_user.id
    ).first()

    if not db_contact:
        raise HTTPException(
            status_code=403, detail="Accès refusé ou contact introuvable")

    for key, value in contact_update.dict().items():
        setattr(db_contact, key, value)

    db.commit()
    db.refresh(db_contact)

    return db_contact


@router.delete("/{contact_id}", status_code=204)
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),  # 👈 L'utilisateur connecté
    db: Session = Depends(get_db)

):
    db_contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id,
        models.Contact.owner_id == current_user.id
    ).first()

    if not db_contact:
        raise HTTPException(
            status_code=403, detail="Accès refusé ou contact introuvable")

    db.delete(db_contact)
    db.commit()
