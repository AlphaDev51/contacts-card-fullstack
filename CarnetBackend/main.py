from fastapi import FastAPI
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import auth, contacts  # 👈 Ajoute `contacts`

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # 👈 L'URL de ton frontend
    allow_credentials=True,
    allow_methods=["*"],  # 👈 Autorise toutes les méthodes (GET, POST, etc.)
    # 👈 Autorise tous les headers (y compris Authorization)
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth",
                   tags=["auth"])        # ✅ Routes d'auth
app.include_router(contacts.router, prefix="/contacts",
                   tags=["contacts"])  # ✅ Routes de contacts
