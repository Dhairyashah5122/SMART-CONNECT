"""
API v1 Router Configuration
MIT License - Westcliff University Property
"""

from fastapi import APIRouter
from .endpoints import search, filters

# Create the main API v1 router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(search.router)
api_router.include_router(filters.router)

# Health check for the entire API
@api_router.get("/health")
async def api_health():
    """Health check for API v1"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": [
            "Advanced Search & Data Mining",
            "Advanced Filtering",
            "Data Export & Extraction"
        ]
    }
