from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import answer_question
router = APIRouter(prefix="/api/assistant", tags=["assistant"])
class Question(BaseModel): question: str
@router.post("/ask")
def ask(payload: Question): return answer_question(payload.question)
