from fastapi import APIRouter
from app.services.weather_service import get_weather
router = APIRouter(prefix="/api/weather", tags=["weather"])
@router.get("/{farm_id}")
def weather(farm_id: int): return get_weather(farm_id)
