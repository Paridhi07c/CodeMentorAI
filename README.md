# CodeMentorAI

Your AI-powered coding mentor.

## Project Description

CodeMentorAI is a modern AI-powered coding mentor and programming learning platform designed to help students and beginner programmers learn programming, understand concepts, debug code, and practice coding problems.

## Features

- AI-powered coding mentor with ChatGPT-style interface
- Code explanation and debugging
- Code generation based on requirements
- Coding practice with progressive AI hints
- Learning roadmaps for multiple programming languages
- Progress tracking and analytics
- Interview preparation with AI feedback
- Courses and structured learning paths

## Technology Stack

### Frontend
- React 19
- JavaScript (JSX)
- Vite
- React Router
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- PostgreSQL (to be integrated)

## Project Structure

```
CodeMentorAI/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout components
│   │   ├── services/     # API services
│   │   ├── data/         # Mock data
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── assets/       # Images, fonts, etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python + FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   └── utils/        # Utility functions
│   ├── requirements.txt
│   └── README.md
├── README.md
└── .gitignore
```

## Installation

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at: http://localhost:5173

### Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly:

```bash
python app/main.py
```

The backend API will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

## Future Improvements

- Real AI API integration (OpenAI, Anthropic, etc.)
- PostgreSQL database integration
- User authentication and authorization
- Real-time code execution
- Advanced analytics and progress tracking
- Mobile application
- Community features and forums

## Author

CodeMentorAI - MCA Academic Project
