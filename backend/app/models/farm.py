from dataclasses import dataclass


@dataclass
class FarmRecord:
    id: int
    user_id: int
    name: str
    location: str
    area: float
    crop: str
    crop_stage: str
    soil_type: str
