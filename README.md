# AIVOA - AI-Powered Customer Complaint Management System

A complete full-stack enterprise complaint management system built for internship assignment demonstration. 
Features AI document extraction (PDF / raw text), automated complaint auto-filling, MySQL database storage, Redux Toolkit state management, and an interactive AI Chat Assistant.

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Lucide Icons, Vite, Modern Glassmorphism CSS.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy ORM.
- **Database**: MySQL (with automatic local SQLite fallback mode if MySQL is not active).
- **AI Engine**: LangGraph & Groq API (`llama-3.3-70b-versatile`).

---

## Features

1. **Upload Complaint PDF/Email**: Drag & drop or select PDF files and raw emails.
2. **AI Extraction**: Analyzes document text with LangGraph + Groq API to extract customer details, urgency, sentiment, summary, and action plan.
3. **Auto-Fill Form**: Populates form fields automatically with extracted AI insights.
4. **Edit Before Saving**: Fully editable form allowing user customization before committing to database.
5. **Save to MySQL**: Persistent database storage with status, priority, category, and tags indexing.
6. **AI Chat Assistant**: Embedded AI copilot for drafting customer response emails, analyzing SLA rules, and answering support queries.
7. **Modern Responsive UI**: Dark glassmorphic dashboard with KPI cards, filtering, search, and analytics breakdown.

---

## Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Start FastAPI Backend Server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` with Swagger UI at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend app will be live at `http://localhost:3000`.

---

## Environment Variables

Edit `backend/.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=complaint_db
GROQ_API_KEY=gsk_your_groq_api_key_here
```
