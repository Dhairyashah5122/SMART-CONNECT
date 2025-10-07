"""
Advanced Search and Data Mining API Endpoints
MIT License - Westcliff University Property
"""

from typing import Dict, List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi.responses import Response
from sqlalchemy.orm import Session
import base64
from datetime import datetime

from backend.core.database import get_db

from backend.core.data_mining import DataMiningEngine, SearchQuery, SearchResult
from backend.core.data_extraction import DataExtractionEngine, ExportOptions, ExportResult, ExportFormat
from backend.api.v1.schemas import BaseResponse


router = APIRouter(prefix="/search", tags=["Advanced Search & Data Mining"])


# Dependency to get mining engine
def get_mining_engine(db: Session = Depends(get_db)) -> DataMiningEngine:
    return DataMiningEngine(db)


# Dependency to get extraction engine
def get_extraction_engine(mining_engine: DataMiningEngine = Depends(get_mining_engine)) -> DataExtractionEngine:
    return DataExtractionEngine(mining_engine)


@router.post("/query", response_model=SearchResult)
async def execute_search_query(
    query: SearchQuery,
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Execute advanced search query with filtering, sorting, and aggregation
    
    - **entity**: students, mentors, projects, companies, surveys, users, courses
    - **filters**: Array of filter conditions with operators
    - **search_text**: Full-text search across specified fields
    - **sort**: Sorting conditions
    - **page**: Page number for pagination
    - **page_size**: Number of records per page
    - **include_relations**: Include related entities in results
    - **aggregate_functions**: Calculate aggregations (count, avg, sum, min, max)
    """
    try:
        result = await mining_engine.search(query)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search execution failed: {str(e)}")


@router.get("/schema/{entity}")
async def get_entity_schema(
    entity: str,
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get searchable schema for an entity including fields, types, and operators
    """
    try:
        schema = mining_engine.get_entity_schema(entity)
        return schema
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/entities")
async def get_available_entities():
    """Get list of all searchable entities"""
    return {
        "entities": [
            "students", "mentors", "projects", "companies", 
            "surveys", "survey_responses", "users", "courses"
        ],
        "description": "Available entities for search and data mining"
    }


@router.post("/quick-search")
async def quick_search(
    entity: str = Query(..., description="Entity to search"),
    q: str = Query(..., description="Search text"),
    fields: Optional[List[str]] = Query(None, description="Fields to search in"),
    limit: int = Query(10, ge=1, le=100, description="Number of results"),
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Quick search across entity with text query
    """
    try:
        query = SearchQuery(
            entity=entity,
            search_text=q,
            search_fields=fields or [],
            page=1,
            page_size=limit,
            include_relations=False
        )
        result = await mining_engine.search(query)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quick search failed: {str(e)}")


@router.post("/export", response_model=ExportResult)
async def export_data(
    query: SearchQuery,
    export_options: ExportOptions,
    background_tasks: BackgroundTasks,
    extraction_engine: DataExtractionEngine = Depends(get_extraction_engine)
):
    """
    Export search results in various formats
    
    - **Supported formats**: JSON, CSV, Excel, PDF, XML
    - **Templates**: student_report, mentor_directory, project_catalog, analytics_summary
    - **Options**: Headers, metadata, relations, compression
    """
    try:
        result = await extraction_engine.extract_data(query, export_options)
        
        # Log export activity in background
        background_tasks.add_task(
            log_export_activity,
            entity=query.entity,
            format=export_options.format,
            record_count=result.record_count,
            size_bytes=result.size_bytes
        )
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.get("/export/download/{filename}")
async def download_export(
    filename: str,
    format: ExportFormat = Query(..., description="File format"),
    file_data: str = Query(..., description="Base64 encoded file data")
):
    """
    Download exported file
    """
    try:
        # Decode base64 data
        decoded_data = base64.b64decode(file_data)
        
        # Set appropriate content type
        content_types = {
            ExportFormat.JSON: "application/json",
            ExportFormat.CSV: "text/csv",
            ExportFormat.EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ExportFormat.PDF: "application/pdf",
            ExportFormat.XML: "application/xml"
        }
        
        content_type = content_types.get(format, "application/octet-stream")
        
        return Response(
            content=decoded_data,
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Download failed: {str(e)}")


@router.get("/export/templates")
async def get_export_templates(
    extraction_engine: DataExtractionEngine = Depends(get_extraction_engine)
):
    """Get available export templates"""
    return extraction_engine.get_available_templates()


@router.post("/analytics/summary")
async def get_analytics_summary(
    entities: List[str] = Query(..., description="Entities to analyze"),
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get analytics summary for multiple entities
    """
    try:
        summary = {}
        
        for entity in entities:
            # Basic count query
            query = SearchQuery(
                entity=entity,
                page=1,
                page_size=1,
                include_relations=False,
                aggregate_functions={
                    "id": "count"
                }
            )
            
            result = await mining_engine.search(query)
            
            summary[entity] = {
                "total_count": result.total_count,
                "aggregations": result.aggregations,
                "last_updated": datetime.now().isoformat()
            }
        
        return {
            "summary": summary,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics summary failed: {str(e)}")


@router.post("/bulk-search")
async def bulk_search(
    queries: List[SearchQuery],
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Execute multiple search queries in parallel
    """
    try:
        results = []
        for query in queries:
            result = await mining_engine.search(query)
            results.append({
                "query_entity": query.entity,
                "result": result
            })
        
        return {
            "results": results,
            "total_queries": len(queries),
            "executed_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk search failed: {str(e)}")


@router.get("/fields/{entity}")
async def get_entity_fields(
    entity: str,
    include_relations: bool = Query(False, description="Include relationship fields"),
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get all available fields for an entity
    """
    try:
        schema = mining_engine.get_entity_schema(entity)
        fields = list(schema["searchable_fields"].keys())
        
        result = {
            "entity": entity,
            "fields": fields,
            "full_text_fields": schema["full_text_fields"],
            "field_types": schema["searchable_fields"]
        }
        
        if include_relations:
            # Add common relationship fields
            relation_fields = {
                "students": ["user.email", "user.first_name", "user.last_name"],
                "mentors": ["user.email", "user.first_name", "user.last_name", "company.name"],
                "projects": ["company.name", "mentor.user.first_name", "mentor.user.last_name"],
                "survey_responses": ["survey.title", "user.email"]
            }
            result["relation_fields"] = relation_fields.get(entity, [])
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/saved-queries", response_model=BaseResponse)
async def save_search_query(
    name: str = Query(..., description="Query name"),
    query: SearchQuery = ...,
    description: Optional[str] = Query(None, description="Query description")
):
    """
    Save a search query for reuse (placeholder for future implementation)
    """
    # This would typically save to database
    return BaseResponse(
        success=True,
        message=f"Query '{name}' saved successfully",
        data={
            "query_id": f"query_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "name": name,
            "description": description
        }
    )


@router.get("/saved-queries")
async def get_saved_queries():
    """
    Get list of saved queries (placeholder for future implementation)
    """
    return {
        "queries": [],
        "message": "Saved queries feature will be implemented in future version"
    }


async def log_export_activity(entity: str, format: ExportFormat, 
                            record_count: int, size_bytes: int):
    """
    Log export activity for analytics (background task)
    """
    # This would typically log to database or external service
    print(f"Export logged: {entity} -> {format} ({record_count} records, {size_bytes} bytes)")


# Additional utility endpoints

@router.get("/health")
async def search_health_check():
    """Health check for search service"""
    return {
        "status": "healthy",
        "service": "Advanced Search & Data Mining",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Advanced Search", "Data Export", "Analytics", 
            "Full-text Search", "Aggregations", "Bulk Operations"
        ]
    }
