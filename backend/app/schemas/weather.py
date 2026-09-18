from pydantic import BaseModel


class WeatherResponse(BaseModel):
    demo: bool = True
    farm_id: int
    temperature: int
    humidity: int
    rainfall_probability: int
    rainfall: str
    wind_kmh: int
    forecast: list[dict]
    agricultural_impact: str
