"""
Simple Test Server for SMART Connect Backend
Test server without complex imports for basic functionality verification
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os
import uvicorn

# Simple app instance
app = FastAPI(
    title="SMART Connect Test API",
    description="Test server for SMART Connect backend functionality",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple models for testing
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
    features: List[str]

class AIProvider(BaseModel):
    name: str
    status: str
    cost_per_1k_tokens: float
    features: List[str]

class DatabaseStatus(BaseModel):
    connected: bool
    host: str
    port: int
    database: str
    schema: str

class TestRequest(BaseModel):
    message: str
    provider: str = "xai"

class TestResponse(BaseModel):
    success: bool
    provider: str
    response: str
    processing_time: float

# Test endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    return HealthResponse(
        status="healthy",
        message="SMART Connect Backend Test Server is running!",
        version="1.0.0",
        features=[
            "AI Adapters (xAI Grok, Ollama, HuggingFace, OpenAI, Google)",
            "Database Integration (PostgreSQL)",
            "File Upload/Download",
            "Advanced Search & Data Mining",
            "Student Ranking & Matching",
            "Report Generation",
            "Admin Dashboard"
        ]
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    return HealthResponse(
        status="healthy",
        message="All systems operational",
        version="1.0.0",
        features=["test_server", "cors_enabled", "api_ready"]
    )

@app.get("/api/v1/ai/providers", response_model=List[AIProvider])
async def get_ai_providers():
    """Get available AI providers"""
    return [
        AIProvider(
            name="xAI Grok",
            status="available",
            cost_per_1k_tokens=0.0,
            features=["text_generation", "analysis", "resume_analysis", "project_matching", "survey_analysis"]
        ),
        AIProvider(
            name="Ollama Local",
            status="available",
            cost_per_1k_tokens=0.0,
            features=["text_generation", "analysis", "student_ranking"]
        ),
        AIProvider(
            name="Hugging Face",
            status="available",
            cost_per_1k_tokens=0.0,
            features=["text_generation", "skill_extraction"]
        ),
        AIProvider(
            name="OpenAI GPT",
            status="configured",
            cost_per_1k_tokens=0.002,
            features=["text_generation", "code_generation", "analysis"]
        ),
        AIProvider(
            name="Google AI",
            status="configured",
            cost_per_1k_tokens=0.001,
            features=["text_generation", "analysis", "summarization"]
        )
    ]

@app.get("/api/v1/database/status", response_model=DatabaseStatus)
async def get_database_status():
    """Get database connection status"""
    return DatabaseStatus(
        connected=True,  # Simulated for test
        host="localhost",
        port=5433,
        database="smart_connect",
        schema="capstone"
    )

@app.post("/api/v1/ai/test", response_model=TestResponse)
async def test_ai_provider(request: TestRequest):
    """Test AI provider functionality"""
    import time
    start_time = time.time()
    
    # Mock AI responses based on provider
    mock_responses = {
        "xai": f"xAI Grok Response: Analyzed your message '{request.message}' and found it interesting. This is a free-tier response from Grok.",
        "ollama": f"Ollama Local Response: Processing '{request.message}' using local LLM. No cost incurred.",
        "huggingface": f"Hugging Face Response: Generated response for '{request.message}' using free transformers.",
        "openai": f"OpenAI GPT Response: High-quality analysis of '{request.message}' with advanced reasoning.",
        "google": f"Google AI Response: Comprehensive understanding of '{request.message}' with multimodal capabilities."
    }
    
    processing_time = time.time() - start_time
    
    return TestResponse(
        success=True,
        provider=request.provider,
        response=mock_responses.get(request.provider, "Unknown provider"),
        processing_time=processing_time
    )

@app.get("/api/v1/features")
async def get_features():
    """Get all available features"""
    return {
        "ai_providers": 5,
        "free_providers": 3,
        "database_tables": 15,
        "api_endpoints": 25,
        "supported_file_formats": ["PDF", "DOCX", "CSV", "JSON", "XLSX", "TXT"],
        "export_formats": ["JSON", "CSV", "Excel", "PDF", "XML"],
        "search_operators": 17,
        "admin_features": [
            "User Management",
            "Storage Monitoring", 
            "AI Cost Tracking",
            "Performance Analytics",
            "System Logs"
        ],
        "student_features": [
            "Profile Management",
            "Skill Assessment",
            "Project Matching",
            "Resume Upload",
            "Progress Tracking"
        ],
        "company_features": [
            "Project Posting",
            "Student Search",
            "Talent Matching",
            "Analytics Dashboard",
            "Communication Tools"
        ]
    }

@app.get("/api/v1/technologies")
async def get_technology_stack():
    """Get technology stack information"""
    return {
        "backend": {
            "framework": "FastAPI",
            "language": "Python 3.12",
            "database": "PostgreSQL 17",
            "orm": "SQLAlchemy",
            "async": "AsyncIO",
            "testing": "pytest"
        },
        "frontend": {
            "framework": "Next.js 15",
            "language": "TypeScript",
            "ui": "Tailwind CSS + shadcn/ui",
            "state": "React Hooks",
            "api": "HTTP/REST"
        },
        "ai_integration": {
            "free_providers": ["xAI Grok", "Ollama", "Hugging Face"],
            "paid_providers": ["OpenAI GPT", "Google AI"],
            "genkit_support": "Firebase Genkit",
            "cost_optimization": "Enabled"
        },
        "deployment": {
            "containerization": "Docker",
            "orchestration": "Docker Compose",
            "cloud_ready": "Azure/AWS/GCP",
            "ci_cd": "GitHub Actions Ready"
        },
        "security": {
            "authentication": "JWT",
            "authorization": "RBAC", 
            "encryption": "bcrypt",
            "cors": "Enabled"
        }
    }

if __name__ == "__main__":
    print("Starting SMART Connect Test Server...")
    print("Features:")
    print("- AI Providers: xAI Grok (FREE), Ollama (FREE), HuggingFace (FREE)")
    print("- Database: PostgreSQL on port 5433")
    print("- CORS: Enabled for frontend on port 3001")
    print("- API Docs: http://localhost:8001/docs")
    print("- Technology Stack: FastAPI + Next.js + PostgreSQL")
    print("")
    
    uvicorn.run(
        "test_server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
