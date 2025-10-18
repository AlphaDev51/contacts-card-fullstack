from fastapi import FastAPI
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import auth, contacts

from fastapi.staticfiles import StaticFiles
import os


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://carnet-frontend.onrender.com"],  # 👈 L'URL de ton frontend
    allow_credentials=True,
    allow_methods=["*"],  # 👈 Autorise toutes les méthodes (GET, POST, etc.)
    # 👈 Autorise tous les headers (y compris Authorization)
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth",
                   tags=["auth"])        # ✅ Routes d'auth
app.include_router(contacts.router, prefix="/contacts",
                   tags=["contacts"])  # ✅ Routes de contacts


# On construit le chemin absolu vers ../frontend/dist
frontend_dist_dir = os.path.join(
    os.path.dirname(__file__), "..", "CarnetDeContact", "dist")

# On vérifie si le dossier existe
if os.path.exists(frontend_dist_dir):

    app.mount("/", StaticFiles(directory=frontend_dist_dir,
              html=True), name="CarnetDeContact")
else:
    print(f"⚠️ Dossier frontend dist introuvable: {frontend_dist_dir}")
    print("   Assure-toi d'avoir fait 'npm run build' dans le dossier frontend.")
