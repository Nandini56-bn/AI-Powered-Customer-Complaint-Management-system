import json
import re
import random
from typing import TypedDict, Dict, Any, List
from app.config import settings

# Attempt to import LangGraph & ChatGroq
try:
    from langgraph.graph import StateGraph, END
    from langchain_groq import ChatGroq
    from langchain_core.messages import SystemMessage, HumanMessage
    HAS_LANGGRAPH = True
except ImportError:
    HAS_LANGGRAPH = False

class ComplaintState(TypedDict):
    raw_text: str
    extracted_data: Dict[str, Any]

def _heuristic_extraction(text: str) -> Dict[str, Any]:
    """
    Smart heuristic extraction engine used as fallback or when Groq API key is pending.
    Extracts emails, customer names, priority, category, sentiment, and summary.
    """
    # Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else "customer@example.com"

    # Extract Name (heuristics)
    name_match = re.search(r'(?:From|Name|Dear|Regards|Sincerely|Customer):\s*([A-Za-z\s]{2,30})', text, re.IGNORECASE)
    if name_match:
        name = name_match.group(1).strip()
    else:
        # Fallback common name generator from text
        words = [w for w in text.split() if w.istitle() and len(w) > 2]
        name = f"{words[0]} {words[1]}" if len(words) >= 2 else "Alex Morgan"

    # Urgency & Priority Detection
    text_lower = text.lower()
    if any(k in text_lower for k in ['urgent', 'immediately', 'critical', 'lawyer', 'overcharged', 'emergency']):
        priority = "Urgent"
        sentiment = "Negative"
    elif any(k in text_lower for k in ['high', 'fail', 'broken', 'issue', 'unacceptable', 'disappointed']):
        priority = "High"
        sentiment = "Negative"
    elif any(k in text_lower for k in ['delay', 'slow', 'question', 'refund']):
        priority = "Medium"
        sentiment = "Negative"
    else:
        priority = "Low"
        sentiment = "Neutral"

    # Category Detection
    if any(k in text_lower for k in ['charge', 'bill', 'billing', 'invoice', 'payment', 'refund', 'price', 'dollar', '$']):
        category = "Billing"
    elif any(k in text_lower for k in ['bug', 'crash', 'error', 'login', 'server', 'technical', 'app', 'system']):
        category = "Technical"
    elif any(k in text_lower for k in ['delivery', 'shipment', 'tracking', 'package', 'courier', 'delay']):
        category = "Delivery"
    elif any(k in text_lower for k in ['defective', 'damage', 'quality', 'product', 'broken']):
        category = "Product Quality"
    else:
        category = "Service"

    # Subject & Summary
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    subject = lines[0][:80] if lines else "Customer Service Complaint Ticket"
    summary = text[:200] + ("..." if len(text) > 200 else "")

    # Suggested Action
    if category == "Billing":
        suggested_action = "Verify invoice transaction ID, process partial/full refund authorization, and email customer confirmation receipt."
    elif category == "Technical":
        suggested_action = "Escalate ticket to Tier-2 Engineering team for system log investigation and patch deployment."
    else:
        suggested_action = "Contact customer via registered email within 24 hours to offer compensation and resolution update."

    ticket_id = f"CMP-2026-{random.randint(1000, 9999)}"

    return {
        "ticket_id": ticket_id,
        "customer_name": name,
        "customer_email": email,
        "category": category,
        "priority": priority,
        "subject": subject,
        "description": text.strip(),
        "summary": summary,
        "sentiment": sentiment,
        "suggested_action": suggested_action,
        "tags": [category.lower(), priority.lower(), "ai-extracted"]
    }

def run_langgraph_extraction(raw_text: str) -> Dict[str, Any]:
    """
    Executes LangGraph workflow with Groq LLM (llama-3.3-70b-versatile or llama3-70b-8192)
    to parse customer complaint text into structured output.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "gsk_your_groq_api_key_here" or not HAS_LANGGRAPH:
        return _heuristic_extraction(raw_text)

    try:
        llm = ChatGroq(
            temperature=0.1,
            groq_api_key=settings.GROQ_API_KEY,
            model_name="llama-3.3-70b-versatile"
        )

        system_prompt = """You are an expert AI Complaint Analysis System.
Analyze the customer complaint text and extract structured JSON matching EXACTLY this format:
{
  "ticket_id": "CMP-2026-XXXX",
  "customer_name": "Full Name",
  "customer_email": "Email Address",
  "category": "Billing" | "Technical" | "Product Quality" | "Delivery" | "Service" | "Other",
  "priority": "Low" | "Medium" | "High" | "Urgent",
  "subject": "Clear concise subject line",
  "description": "Full complaint text",
  "summary": "2-sentence executive summary of root cause",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "suggested_action": "Actionable step-by-step resolution plan for support agent",
  "tags": ["tag1", "tag2"]
}
Return ONLY valid JSON with no markdown wrapping or additional explanations."""

        messages = [
          SystemMessage(content=system_prompt),
          HumanMessage(content=f"Customer Complaint Document:\n{raw_text}")
        ]

        response = llm.invoke(messages)
        content = response.content.strip()
        
        # Clean JSON markdown fences if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        parsed = json.loads(content.strip())
        if "ticket_id" not in parsed or not parsed["ticket_id"]:
            parsed["ticket_id"] = f"CMP-2026-{random.randint(1000, 9999)}"
        return parsed
    except Exception as e:
        print(f"[LangGraph Extractor Warning] Groq API call failed or timed out ({e}). Using smart heuristic fallback.")
        return _heuristic_extraction(raw_text)
