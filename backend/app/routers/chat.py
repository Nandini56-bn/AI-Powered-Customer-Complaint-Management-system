from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services.ai_chat import run_ai_chat_assistant

router = APIRouter(prefix="/api/chat", tags=["AI Chat Assistant"])

@router.post("", response_model=ChatResponse)
def ai_chat_endpoint(payload: ChatRequest, db: Session = Depends(get_db)):
    """
    AI Chat assistant for answering questions, drafting emails, and generating complaint resolution plans based on saved database records.
    """
    result = run_ai_chat_assistant(payload.message, db=db, context=payload.context)
    return result

