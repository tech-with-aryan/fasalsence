from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database.connection import get_connection
from app.utils.helpers import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

class AuthRequest(BaseModel):
    name: str | None = None
    contact: str
    password: str

@router.post("/register")
def register(payload: AuthRequest):
    if not payload.name:
        raise HTTPException(422, "Name is required for registration")
    with get_connection() as db:
        try:
            cursor = db.execute("INSERT INTO users (name, contact, password_hash) VALUES (?, ?, ?)", (payload.name, payload.contact, hash_password(payload.password)))
            db.execute("INSERT INTO farms (user_id, name, location, area, crop, crop_stage, soil_type) VALUES (?, ?, ?, ?, ?, ?, ?)", (cursor.lastrowid, "My Farm", "Location not set", 1.0, "Wheat", "Vegetative", "Not available"))
            db.commit()
        except Exception as error:
            if "UNIQUE" in str(error):
                raise HTTPException(409, "An account with this contact already exists")
            raise
    return {"message": "Registration successful", "demo": True, "user": {"id": cursor.lastrowid, "name": payload.name, "contact": payload.contact}}

@router.post("/login")
def login(payload: AuthRequest):
    with get_connection() as db:
        user = db.execute("SELECT * FROM users WHERE contact = ?", (payload.contact,)).fetchone()
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid contact or password")
    return {"message": "Login successful", "demo": True, "token": f"demo-user-{user['id']}", "user": {"id": user["id"], "name": user["name"], "contact": user["contact"]}}
