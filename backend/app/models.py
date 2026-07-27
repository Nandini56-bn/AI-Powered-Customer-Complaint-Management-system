from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(String(20), unique=True, index=True, nullable=False)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    category = Column(String(50), default="Technical")
    priority = Column(String(20), default="Medium")
    status = Column(String(20), default="Pending")
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    sentiment = Column(String(20), default="Neutral")
    suggested_action = Column(Text, nullable=True)
    tags = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
