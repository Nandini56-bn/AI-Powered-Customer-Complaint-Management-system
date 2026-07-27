from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class ComplaintBase(BaseModel):
    ticket_id: Optional[str] = None
    customer_name: str
    customer_email: str
    category: Optional[str] = "Technical"
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"
    subject: str
    description: str
    summary: Optional[str] = None
    sentiment: Optional[str] = "Neutral"
    suggested_action: Optional[str] = None
    tags: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    suggested_action: Optional[str] = None
    tags: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ExtractedComplaint(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    category: str
    priority: str
    subject: str
    description: str
    summary: str
    sentiment: str
    suggested_action: str
    tags: List[str]

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = []

class StatsResponse(BaseModel):
    total: int
    pending: int
    in_progress: int
    resolved: int
    escalated: int
    urgent: int
    category_counts: Dict[str, int]
