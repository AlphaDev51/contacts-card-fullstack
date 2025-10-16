from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# 1. URL de la DB
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./contacts.db")
# (ça crée un fichier contacts.db dans ton dossier backend)

# 2. Connexion à la DB
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. "Session" = la boîte magique pour parler à la DB
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 4. Classe de base pour déclarer nos futurs models
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
