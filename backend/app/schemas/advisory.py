from pydantic import BaseModel


class AdvisoryResponse(BaseModel):
    demo: bool = True
    farm_id: int
    crop: str
    location: str
    recommendations: list[dict]
    reasoning: list[dict]
