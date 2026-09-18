from fastapi import APIRouter
router = APIRouter(prefix="/api/notifications", tags=["notifications"])
@router.get("")
def notifications(): return {"demo": True, "items": [{"category": "Weather Alert", "message": "Rain expected tomorrow."}, {"category": "Crop Health", "message": "Vegetation health signal decreased compared with recent baseline."}, {"category": "Disease Check", "message": "Your uploaded image has been analyzed."}]}
