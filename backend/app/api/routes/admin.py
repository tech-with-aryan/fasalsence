from fastapi import APIRouter
from app.database.connection import get_connection
router = APIRouter(prefix="/api/admin", tags=["admin"])
@router.get("/overview")
def overview(): return {"demo": True, "fields_monitored": 12, "active_advisories": 5, "health_alerts": 3, "weather_risks": 2}
@router.get("/farms")
def farms():
    with get_connection() as db: rows = db.execute("SELECT id, name, crop, location FROM farms").fetchall()
    return [{**dict(row), "health": 78, "weather_risk": "Moderate", "advisory": "Active", "status": "Review"} for row in rows]
