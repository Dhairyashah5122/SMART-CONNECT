"""
SMART Connect Backend API
Main FastAPI application entry point with middleware and route registration
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import uvicorn

from core.config import settings
from core.database import create_tables, check_db_connection
from ai_adapters.manager import ai_manager

# Import routers
from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.students import router as students_router
from api.v1.endpoints.rank_students import router as ranking_router
from api.v1.endpoints.search import router as search_router
from api.v1.endpoints.filters import router as filters_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.environment == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    
    # Startup
    logger.info("Starting SMART Connect API...")
    
    # Check database connection
    if not check_db_connection():
        logger.error("Database connection failed!")
        raise Exception("Cannot connect to database")
    
    # Create database tables
    try:
        create_tables()
        logger.info("Database tables ready")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise
    
    # Check AI providers
    provider_status = ai_manager.get_provider_status()
    available_providers = [name for name, status in provider_status.items() if status["available"]]
    logger.info(f"Available AI providers: {available_providers}")
    
    if not available_providers:
        logger.warning("No AI providers available! Some features may not work.")
    
    logger.info("SMART Connect API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down SMART Connect API...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for SMART Connect - Student Capstone Project Management Platform",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

if settings.environment == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
    )


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.3f}s")
    
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    if settings.debug:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "detail": str(exc),
                "debug": True
            }
        )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    
    # Check database
    db_status = check_db_connection()
    
    # Check AI providers
    ai_status = ai_manager.get_provider_status()
    available_ai_providers = [name for name, status in ai_status.items() if status["available"]]
    
    # Get cost summary
    cost_summary = ai_manager.get_cost_summary()
    
    return {
        "status": "healthy" if db_status else "degraded",
        "timestamp": time.time(),
        "version": settings.app_version,
        "environment": settings.environment,
        "database": {
            "connected": db_status,
            "schema": settings.db_schema
        },
        "ai_providers": {
            "available": available_ai_providers,
            "total_configured": len(ai_status),
            "daily_cost": cost_summary["daily_cost"],
            "cost_limit": cost_summary["daily_limit"]
        }
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to SMART Connect API",
        "version": settings.app_version,
        "docs": "/docs" if settings.debug else "Documentation not available in production",
        "health": "/health"
    }


# Register API routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(students_router, prefix="/api/v1")
app.include_router(ranking_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(filters_router, prefix="/api/v1")


# Additional API endpoints for other entities
@app.get("/api/v1/status")
async def api_status():
    """API status and capabilities"""
    
    ai_status = ai_manager.get_provider_status()
    cost_summary = ai_manager.get_cost_summary()
    
    return {
        "api_version": "v1",
        "features": {
            "authentication": True,
            "student_management": True,
            "ai_ranking": len([p for p, s in ai_status.items() if s["available"]]) > 0,
            "project_matching": True,
            "mentor_management": True,
            "admin_functions": True,
            "advanced_search": True,
            "data_mining": True,
            "data_export": True,
            "advanced_filtering": True
        },
        "ai_capabilities": {
            "student_ranking": True,
            "skill_extraction": True,
            "project_matching": True,
            "cost_optimization": True,
            "multi_provider": True
        },
        "cost_tracking": {
            "daily_cost": cost_summary["daily_cost"],
            "daily_limit": cost_summary["daily_limit"],
            "usage_percentage": cost_summary["cost_percentage"]
        },
        "providers": ai_status
    }


# AI cost endpoint
@app.get("/api/v1/ai/costs")
async def get_ai_costs():
    """Get AI usage costs and statistics"""
    return ai_manager.get_cost_summary()


# AI provider status endpoint
@app.get("/api/v1/ai/providers")
async def get_ai_providers():
    """Get AI provider status and capabilities"""
    return ai_manager.get_provider_status()


if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload and settings.environment == "development",
        log_level="info" if settings.environment == "production" else "debug"
    )