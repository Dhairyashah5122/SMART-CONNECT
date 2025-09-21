#!/usr/bin/env python3
"""
Simple SMART CONNECTION Backend Server
Launches without complex AI adapter dependencies
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from pathlib import Path

# Simple FastAPI app
app = FastAPI(
    title="SMART CONNECTION API",
    description="Backend API for student talent matching system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "SMART CONNECTION API is running!", "status": "active"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "SMART CONNECTION Backend"}

@app.get("/api/search/students")
async def search_students(q: str = "", page: int = 1, limit: int = 10):
    """Mock student search endpoint"""
    # Generate mock student data
    mock_students = []
    start_id = (page - 1) * limit + 1
    
    for i in range(limit):
        student_id = start_id + i
        mock_students.append({
            "id": student_id,
            "name": f"Student {student_id}",
            "email": f"student{student_id}@university.edu",
            "major": "Computer Science" if student_id % 3 == 0 else "Engineering" if student_id % 2 == 0 else "Business",
            "gpa": round(3.0 + (student_id % 10) * 0.1, 2),
            "skills": ["Python", "JavaScript", "React"] if student_id % 2 == 0 else ["Java", "SQL", "Data Analysis"],
            "year": "Senior" if student_id % 4 == 0 else "Junior",
            "projects": student_id % 3 + 1,
            "score": round(85 + (student_id % 15), 1)
        })
    
    return {
        "students": mock_students,
        "total": 150,  # Mock total
        "page": page,
        "limit": limit,
        "query": q
    }

@app.get("/api/ai/status")
async def ai_status():
    """AI providers status"""
    return {
        "providers": {
            "openai": {"status": "available", "cost": "paid"},
            "google": {"status": "available", "cost": "paid"},
            "local": {"status": "mock", "cost": "free"}
        },
        "active_provider": "mock",
        "message": "Running in simplified mode"
    }

@app.post("/api/ai/analyze")
async def analyze_data(data: dict):
    """Mock AI analysis endpoint"""
    return {
        "analysis": "Mock analysis result",
        "confidence": 0.85,
        "recommendations": [
            "Student shows strong technical skills",
            "Recommended for software development roles",
            "Consider for advanced projects"
        ],
        "provider_used": "mock"
    }

if __name__ == "__main__":
    print("🚀 Starting SMART CONNECTION Backend...")
    print("📡 Server will run on http://localhost:8001")
    print("🔧 Running in simplified mode (no complex AI dependencies)")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )