from fastapi import APIRouter, UploadFile, File
from app.services.disease_service import analyze_disease
router = APIRouter(prefix="/api/disease", tags=["disease"])
@router.post("/analyze")
async def analyze(file: UploadFile | None = File(default=None)):
    return analyze_disease(file.filename if file else None)
