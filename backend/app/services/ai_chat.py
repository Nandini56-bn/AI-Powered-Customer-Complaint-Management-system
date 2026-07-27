from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models import Complaint

try:
    from langchain_groq import ChatGroq
    from langchain_core.messages import SystemMessage, HumanMessage
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

def run_ai_chat_assistant(user_message: str, db: Optional[Session] = None, context: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes LangGraph / Groq AI Copilot conversational engine integrated with saved MySQL/SQLite complaint database.
    """
    # 1. Fetch complaints context from Database
    db_context_str = ""
    latest_complaint = None
    all_recent = []

    if db:
        try:
            latest_complaint = db.query(Complaint).order_by(Complaint.created_at.desc(), Complaint.id.desc()).first()
            all_recent = db.query(Complaint).order_by(Complaint.created_at.desc(), Complaint.id.desc()).limit(10).all()
        except Exception as err:
            print(f"[AI Chat DB Error] {err}")

    if latest_complaint:
        db_context_str += f"""
=== LATEST COMPLAINT IN DATABASE ===
Ticket ID: {latest_complaint.ticket_id}
Customer Name: {latest_complaint.customer_name}
Customer Email: {latest_complaint.customer_email}
Category: {latest_complaint.category}
Priority: {latest_complaint.priority}
Status: {latest_complaint.status}
Subject: {latest_complaint.subject}
Description: {latest_complaint.description}
AI Summary: {latest_complaint.summary or 'N/A'}
Sentiment: {latest_complaint.sentiment or 'Neutral'}
Suggested Resolution Action: {latest_complaint.suggested_action or 'N/A'}
Tags: {latest_complaint.tags or 'N/A'}
Created At: {latest_complaint.created_at}
"""

    if all_recent:
        db_context_str += f"\n=== TOTAL RECENT COMPLAINTS IN DB: {len(all_recent)} ===\n"
        for idx, item in enumerate(all_recent, 1):
            db_context_str += f"{idx}. [{item.ticket_id}] {item.subject} | Customer: {item.customer_name} | Priority: {item.priority} | Status: {item.status} | Category: {item.category}\n"

    if context:
        db_context_str += f"\n=== ADDITIONAL FRONTEND CONTEXT ===\n{context}"

    # 2. Call Groq LLM if API Key is configured
    if HAS_GROQ and settings.GROQ_API_KEY and settings.GROQ_API_KEY != "gsk_your_groq_api_key_here":
        try:
            llm = ChatGroq(
                temperature=0.2,
                groq_api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile"
            )

            system_prompt = f"""You are AIVOA AI Copilot, an expert customer complaint resolution assistant.
You have REAL-TIME access to the customer complaint database provided below.
Answer user questions accurately and specifically using the complaint data from the database context.
If asked to summarize, give details about the specific complaint.
If asked about priority, state the exact priority of the relevant complaint.
If asked for a resolution, suggest concrete resolution steps based on the complaint's root cause and category.

DATABASE CONTEXT:
{db_context_str}"""

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"User Query: {user_message}")
            ]

            response = llm.invoke(messages)
            return {
                "reply": response.content.strip(),
                "suggested_actions": ["Copy Response", "Draft Customer Email", "Update Ticket Status"]
            }
        except Exception as e:
            print(f"[AI Chat Assistant Warning] Groq API call failed ({e}). Executing intelligent fallback engine.")

    # 3. Dynamic Complaint-Aware Rule Engine (Fallback)
    msg_lower = user_message.lower()

    if latest_complaint:
        # Priority Question Check (Check first to avoid generic match)
        if "priority" in msg_lower:
            reply = (
                f"The priority of the latest complaint (**{latest_complaint.ticket_id}**: *\"{latest_complaint.subject}\"*) is **{latest_complaint.priority}**.\n\n"
                f"• **Customer**: {latest_complaint.customer_name} (`{latest_complaint.customer_email}`)\n"
                f"• **Category**: {latest_complaint.category}\n"
                f"• **Current Status**: {latest_complaint.status}"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Escalate Priority", "Mark as In Progress", "Assign Agent"]
            }

        # Resolution Suggestion Question Check
        if any(k in msg_lower for k in ["resolution", "suggest", "action", "fix", "resolve"]):
            rec_action = latest_complaint.suggested_action or (
                f"Process refund and issue apology email for {latest_complaint.category} issue." 
                if latest_complaint.category == "Billing" else
                f"Escalate {latest_complaint.ticket_id} to technical engineering for root cause investigation."
            )
            reply = (
                f"**Suggested Resolution Plan for Ticket `{latest_complaint.ticket_id}`** ({latest_complaint.subject}):\n\n"
                f"1. **Primary Action**: {rec_action}\n"
                f"2. **Customer Follow-up**: Contact {latest_complaint.customer_name} at `{latest_complaint.customer_email}` with ticket update.\n"
                f"3. **SLA Target**: Priority is **{latest_complaint.priority}**, resolve within target timeframe.\n"
                f"4. **Post-Incident**: Document root cause under {latest_complaint.category} category tags."
            )
            return {
                "reply": reply,
                "suggested_actions": ["Draft Resolution Email", "Mark Resolved", "Escalate Ticket"]
            }

        # Latest Complaint Summary Question Check
        if any(k in msg_lower for k in ["latest complaint", "latest ticket", "summarize", "summary"]):
            reply = (
                f"**Latest Complaint Summary ({latest_complaint.ticket_id})**:\n\n"
                f"• **Ticket ID**: `{latest_complaint.ticket_id}`\n"
                f"• **Customer**: {latest_complaint.customer_name} ({latest_complaint.customer_email})\n"
                f"• **Subject**: {latest_complaint.subject}\n"
                f"• **Category**: {latest_complaint.category} | **Priority**: {latest_complaint.priority} | **Status**: {latest_complaint.status}\n"
                f"• **Sentiment**: {latest_complaint.sentiment}\n"
                f"• **Executive Summary**: {latest_complaint.summary or latest_complaint.description[:200]}\n"
                f"• **Recommended Action**: {latest_complaint.suggested_action or 'Investigate issue and contact customer.'}"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Draft Customer Reply", "Change Status", "View Full Details"]
            }

        # Email Draft Question Check
        if any(k in msg_lower for k in ["draft", "email", "apology", "reply", "response"]):
            reply = (
                f"Here is a customized customer response email draft for **{latest_complaint.customer_name}** (`{latest_complaint.ticket_id}`):\n\n"
                f"**Subject**: Update Regarding Your Complaint - Ticket {latest_complaint.ticket_id}\n\n"
                f"Dear {latest_complaint.customer_name},\n\n"
                f"Thank you for contacting AIVOA Customer Support regarding: \"{latest_complaint.subject}\". "
                f"We sincerely apologize for the inconvenience this issue has caused you.\n\n"
                f"Our operations team has categorized your request as **{latest_complaint.priority} Priority** under **{latest_complaint.category}**. "
                f"We are actively implementing the following resolution:\n"
                f"👉 {latest_complaint.suggested_action or 'Investigating root cause and applying account credit.'}\n\n"
                f"If you have additional questions, please reply directly to this email.\n\n"
                f"Best regards,\n"
                f"Customer Support Ops Team\nAIVOA Systems"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Copy Email Draft", "Send Email", "Update Ticket Status"]
            }

    # Generic query fallback when no database records exist yet
    reply = (
        f"I received your question: \"{user_message}\".\n\n"
        "Currently, there are no complaint records in the database. "
        "Upload a complaint PDF or create a ticket to get complaint-specific summaries, priority checks, and resolution plans!"
    )
    return {
        "reply": reply,
        "suggested_actions": ["Upload Complaint PDF", "Refresh System", "View Analytics"]
    }
