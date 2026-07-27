from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app.database import get_db, DB_TYPE
from app.models import Complaint
from app.schemas import (
    ComplaintCreate, 
    ComplaintUpdate, 
    ComplaintResponse, 
    ExtractedComplaint,
    StatsResponse
)
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_extractor import run_langgraph_extraction

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.post("/extract", response_model=ExtractedComplaint)
async def extract_complaint_details(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    """
    1. Upload complaint PDF/email.
    2. Extract complaint details using LangGraph + Groq AI.
    3. Auto-fill complaint form fields.
    """
    raw_text = ""
    if file:
        content = await file.read()
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            raw_text = extract_text_from_pdf(content)
        else:
            raw_text = content.decode("utf-8", errors="ignore")
    elif text:
        raw_text = text
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF/text file or provide complaint text.")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="No readable content extracted from document.")

    extracted_dict = run_langgraph_extraction(raw_text)
    return extracted_dict

@router.post("", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Save edited complaint to MySQL database.
    """
    if not complaint.ticket_id:
        complaint.ticket_id = f"CMP-2026-{random.randint(1000, 9999)}"

    # Check for existing ticket ID collision
    existing = db.query(Complaint).filter(Complaint.ticket_id == complaint.ticket_id).first()
    if existing:
        complaint.ticket_id = f"CMP-2026-{random.randint(1000, 9999)}"

    db_complaint = Complaint(**complaint.dict())
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)

    if status and status.lower() != "all":
        query = query.filter(Complaint.status == status)
    if priority and priority.lower() != "all":
        query = query.filter(Complaint.priority == priority)
    if category and category.lower() != "all":
        query = query.filter(Complaint.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Complaint.ticket_id.like(search_filter)) |
            (Complaint.customer_name.like(search_filter)) |
            (Complaint.subject.like(search_filter)) |
            (Complaint.description.like(search_filter))
        )

    return query.order_by(Complaint.created_at.desc()).all()

@router.get("/stats", response_model=StatsResponse)
def get_complaint_stats(db: Session = Depends(get_db)):
    all_complaints = db.query(Complaint).all()
    
    total = len(all_complaints)
    pending = sum(1 for c in all_complaints if c.status == "Pending")
    in_progress = sum(1 for c in all_complaints if c.status == "In Progress")
    resolved = sum(1 for c in all_complaints if c.status == "Resolved")
    escalated = sum(1 for c in all_complaints if c.status == "Escalated")
    urgent = sum(1 for c in all_complaints if c.priority == "Urgent")

    category_counts = {}
    for c in all_complaints:
        cat = c.category or "Other"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "escalated": escalated,
        "urgent": urgent,
        "category_counts": category_counts
    }

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(complaint_id: int, update_data: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(complaint, key, value)

    db.commit()
    db.refresh(complaint)
    return complaint

@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully"}
