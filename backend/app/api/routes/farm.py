from fastapi import APIRouter, HTTPException
from app.database.connection import get_connection
from app.schemas.farm import FarmCreate

router = APIRouter(prefix="/api/farms", tags=["farms"])

def row_to_dict(row): return dict(row)

@router.get("")
def list_farms(user_id: int = 1):
    with get_connection() as db: return [row_to_dict(row) for row in db.execute("SELECT * FROM farms WHERE user_id = ?", (user_id,)).fetchall()]

@router.post("")
def create_farm(payload: FarmCreate, user_id: int = 1):
    with get_connection() as db:
        cursor = db.execute("INSERT INTO farms (user_id, name, location, area, crop, crop_stage, soil_type, sowing_date, irrigation_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (user_id, payload.name, payload.location, payload.area, payload.crop, payload.crop_stage, payload.soil_type, payload.sowing_date, payload.irrigation_method))
        db.commit()
        return row_to_dict(db.execute("SELECT * FROM farms WHERE id = ?", (cursor.lastrowid,)).fetchone())

@router.get("/{farm_id}")
def get_farm(farm_id: int):
    with get_connection() as db: farm = db.execute("SELECT * FROM farms WHERE id = ?", (farm_id,)).fetchone()
    if not farm: raise HTTPException(404, "Farm not found")
    return row_to_dict(farm)

@router.put("/{farm_id}")
def update_farm(farm_id: int, payload: FarmCreate):
    with get_connection() as db:
        if not db.execute("SELECT id FROM farms WHERE id = ?", (farm_id,)).fetchone(): raise HTTPException(404, "Farm not found")
        db.execute("UPDATE farms SET name=?, location=?, area=?, crop=?, crop_stage=?, soil_type=?, sowing_date=?, irrigation_method=? WHERE id=?", (*payload.model_dump().values(), farm_id))
        db.commit()
        return row_to_dict(db.execute("SELECT * FROM farms WHERE id = ?", (farm_id,)).fetchone())
