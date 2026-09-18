from fastapi import APIRouter
from app.services.satellite_service import get_crop_health, get_satellite
router = APIRouter(tags=["crop health"])
@router.get("/api/crop-health/{farm_id}")
def crop_health(farm_id: int): return get_crop_health(farm_id)
@router.get("/api/satellite/{farm_id}")
def satellite(farm_id: int): return get_satellite(farm_id)
