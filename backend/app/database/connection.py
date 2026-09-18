import sqlite3
import os
from pathlib import Path
from app.config import settings


def get_connection() -> sqlite3.Connection:
    database_path = "/tmp/fasalsence.db" if os.getenv("VERCEL") else settings.database_path
    connection = sqlite3.connect(Path(database_path))
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS farms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            area REAL NOT NULL,
            crop TEXT NOT NULL,
            crop_stage TEXT NOT NULL,
            soil_type TEXT NOT NULL,
            sowing_date TEXT,
            irrigation_method TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)
