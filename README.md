# AIVOA – AI-Powered Customer Complaint Management System

A full-stack customer complaint management system developed as part of an internship assignment. The application allows users to upload complaint documents, extract key complaint information, manage complaint records, and interact with an AI-powered assistant.

## Features

* Upload complaint documents (PDF/Text)
* AI-assisted complaint information extraction
* Auto-fill complaint details
* Edit complaint information before saving
* Store complaint records in a database
* AI Chat Assistant for customer support queries
* Complaint dashboard with search and filtering
* Responsive and modern user interface

## Technology Stack

### Frontend

* React 18
* Vite
* Redux Toolkit
* Lucide React
* CSS

### Backend

* FastAPI
* SQLAlchemy

### Database

* MySQL
* SQLite (Fallback)

### AI Integration

* LangGraph
* Groq API (Llama 3.3 70B Versatile)

---

# Project Setup

## 1. Backend

```bash
cd backend

python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend URL:

```
http://localhost:8000
```

API Documentation (Swagger):

```
http://localhost:8000/docs
```

---

## 2. Frontend

```bash
cd frontend

npm install

npm run dev
```

Open the application in your browser using the URL shown in the terminal (commonly `http://localhost:5173` when using Vite).

---

# Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=complaint_db

GROQ_API_KEY=your_groq_api_key
```

> **Note:** Do not upload your actual API key to GitHub. Replace it with a placeholder before pushing your project.

---

# Project Structure

```
AIVOA/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# Notes

* This project was developed for learning and internship demonstration purposes.
* The application supports MySQL and automatically falls back to SQLite when MySQL is unavailable.
* AI-generated complaint extraction depends on a valid Groq API key.

