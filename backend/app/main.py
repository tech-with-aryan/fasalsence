from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import init_db
from app.database.seed import seed_demo_data
from app.api.routes import admin, advisory, assistant, auth, disease, farm, notifications, satellite, weather

@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    seed_demo_data()
    yield

app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

for router in (auth.router, farm.router, weather.router, satellite.router, advisory.router, disease.router, assistant.router, notifications.router, admin.router):
    app.include_router(router)

@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "service": "fasalsence-backend", "demo": True}
