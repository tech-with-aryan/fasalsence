from pydantic import BaseModel, Field


class FarmCreate(BaseModel):
    name: str
    location: str
    area: float = Field(gt=0)
    crop: str
    crop_stage: str = "Vegetative"
    soil_type: str = "Not available"
    sowing_date: str | None = None
    irrigation_method: str | None = None


class Farm(FarmCreate):
    id: int
    user_id: int
