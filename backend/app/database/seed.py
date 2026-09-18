from app.database.connection import get_connection
from app.utils.helpers import hash_password


def seed_demo_data() -> None:
    with get_connection() as connection:
        user = connection.execute("SELECT id FROM users WHERE contact = ?", ("demo@fasalsence.local",)).fetchone()
        if user:
            return
        cursor = connection.execute(
            "INSERT INTO users (name, contact, password_hash) VALUES (?, ?, ?)",
            ("Aryan Singh", "demo@fasalsence.local", hash_password("demo123")),
        )
        connection.execute(
            "INSERT INTO farms (user_id, name, location, area, crop, crop_stage, soil_type, sowing_date, irrigation_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (cursor.lastrowid, "Ravi Farm", "Prayagraj, Uttar Pradesh", 1.5, "Wheat", "Vegetative", "Loamy", "2026-11-10", "Canal"),
        )
        connection.commit()
