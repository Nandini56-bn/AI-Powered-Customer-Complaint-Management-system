import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal, DB_TYPE
from app.models import Complaint
from app.routers import complaints, chat
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title="AIVOA - AI Customer Complaint Management API",
    description="Backend API powered by FastAPI, MySQL/SQLAlchemy, LangGraph & Groq API",
    version="1.0.0"
)

# CORS middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(complaints.router)
app.include_router(chat.router)

def seed_sample_complaints():
    """
    Seeds initial realistic sample complaints into DB if empty.
    """
    db = SessionLocal()
    try:
        count = db.query(Complaint).count()
        if count == 0:
            logger.info("Database is empty. Seeding initial sample complaints...")
            samples = [
                Complaint(
                    ticket_id="CMP-2026-1001",
                    customer_name="Sarah Jenkins",
                    customer_email="sarah.jenkins@example.com",
                    category="Billing",
                    priority="Urgent",
                    status="Pending",
                    subject="Unauthorized $299 subscription recurring charge",
                    description="I noticed an unauthorized charge of $299 on my credit card statement dated July 24th. I cancelled my annual subscription two months ago and received a cancellation receipt.",
                    summary="Customer charged $299 after subscription cancellation confirmation.",
                    sentiment="Negative",
                    suggested_action="Verify cancellation logs, issue $299 refund, and notify customer with refund receipt.",
                    tags="billing, refund, urgent"
                ),
                Complaint(
                    ticket_id="CMP-2026-1002",
                    customer_name="Michael Chen",
                    customer_email="m.chen@techcorp.io",
                    category="Technical",
                    priority="High",
                    status="In Progress",
                    subject="Database sync timeout error on production dashboard",
                    description="Our API sync jobs fail repeatedly with 504 gateway timeout when exporting weekly telemetry logs. Impacting our reporting pipeline.",
                    summary="Production API 504 gateway timeout during weekly telemetry export.",
                    sentiment="Negative",
                    suggested_action="Escalate to DevOps/Database Admin team to optimize export query execution plan and increase gateway timeout limit.",
                    tags="api, timeout, production"
                ),
                Complaint(
                    ticket_id="CMP-2026-1003",
                    customer_name="David Ross",
                    customer_email="david.ross@gmail.com",
                    category="Delivery",
                    priority="Medium",
                    status="Resolved",
                    subject="Package shipment delayed by 5 business days",
                    description="Order #88392 was scheduled to arrive on Monday. Tracking shows package stuck at regional distribution center without scan updates.",
                    summary="Order delivery delayed due to logistics hub bottleneck.",
                    sentiment="Neutral",
                    suggested_action="Track package with courier service, apply $15 shipping credit voucher.",
                    tags="shipping, delay, resolved"
                ),
                Complaint(
                    ticket_id="CMP-2026-1004",
                    customer_name="Emily Taylor",
                    customer_email="emily.t@designstudio.com",
                    category="Product Quality",
                    priority="High",
                    status="Pending",
                    subject="Hardware display flickering on newly delivered unit",
                    description="The monitor unit received today displays intermittent vertical flickering lines when connected via DisplayPort.",
                    summary="Defective hardware monitor unit exhibiting screen flicker out of the box.",
                    sentiment="Negative",
                    suggested_action="Issue return authorization label (RMA) and dispatch replacement unit via express shipping.",
                    tags="hardware, RMA, replacement"
                )
            ]
            db.add_all(samples)
            db.commit()
            logger.info("Successfully seeded sample complaints!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    logger.info(f"Initializing Database Tables using [{DB_TYPE}] Engine...")
    Base.metadata.create_all(bind=engine)
    seed_sample_complaints()

@app.get("/")
def root():
    return {
        "system": "AIVOA Customer Complaint Management System API",
        "status": "Online",
        "database": DB_TYPE,
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
