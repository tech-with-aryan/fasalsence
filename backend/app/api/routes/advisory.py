from fastapi import APIRouter
from app.services.advisory_service import get_advisory
from app.database.connection import get_connection
router = APIRouter(prefix="/api/advisories", tags=["advisory"])
@router.get("/{farm_id}")
def advisory(farm_id: int):
    with get_connection() as db: farm = db.execute("SELECT crop, location FROM farms WHERE id = ?", (farm_id,)).fetchone()
    return get_advisory(farm_id, farm["crop"] if farm else "Wheat", farm["location"] if farm else "Prayagraj, Uttar Pradesh")
