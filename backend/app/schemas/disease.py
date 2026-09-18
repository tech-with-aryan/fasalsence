from pydantic import BaseModel


class DiseaseResponse(BaseModel):
    demo: bool = True
    status: str
    possible_issue: str
    confidence: int
    risk: str
    next_steps: list[str]
    notice: str
