"""
Advanced Filtering API Endpoints
MIT License - Westcliff University Property
"""

from typing import Dict, List, Optional, Any, Union
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, date
from pydantic import BaseModel, Field

from ....core.database import get_db
from ....core.data_mining import DataMiningEngine, SearchQuery, FilterCondition, SortCondition, SearchOperator, DataType, SortOrder
from ..schemas import BaseResponse

router = APIRouter(prefix="/filters", tags=["Advanced Filtering"])


class FilterOption(BaseModel):
    label: str
    value: Any
    count: Optional[int] = None


class FilterDefinition(BaseModel):
    field: str
    field_type: DataType
    display_name: str
    operators: List[SearchOperator]
    options: Optional[List[FilterOption]] = None
    min_value: Optional[Union[int, float]] = None
    max_value: Optional[Union[int, float]] = None
    default_operator: SearchOperator = SearchOperator.EQUALS


class FilterGroup(BaseModel):
    name: str
    display_name: str
    filters: List[FilterDefinition]


class FilterPreset(BaseModel):
    name: str
    display_name: str
    description: str
    entity: str
    filters: List[FilterCondition]
    sort: List[SortCondition] = Field(default_factory=list)


class FilterSuggestion(BaseModel):
    field: str
    operator: SearchOperator
    suggested_values: List[Any]
    description: str


def get_mining_engine(db: Session = Depends(get_db)) -> DataMiningEngine:
    return DataMiningEngine(db)


@router.get("/definitions/{entity}")
async def get_filter_definitions(
    entity: str,
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get comprehensive filter definitions for an entity
    """
    try:
        schema = mining_engine.get_entity_schema(entity)
        searchable_fields = schema["searchable_fields"]
        
        # Group filters by category
        filter_groups = []
        
        # Basic Information Group
        basic_fields = []
        identity_fields = ["id", "email", "first_name", "last_name", "name", "title"]
        
        for field, field_type in searchable_fields.items():
            if any(identity in field.lower() for identity in identity_fields):
                operators = [SearchOperator.EQUALS, SearchOperator.CONTAINS, SearchOperator.STARTS_WITH]
                if field_type == DataType.STRING:
                    operators.extend([SearchOperator.NOT_EQUALS, SearchOperator.ENDS_WITH])
                
                basic_fields.append(FilterDefinition(
                    field=field,
                    field_type=field_type,
                    display_name=field.replace("_", " ").title(),
                    operators=operators,
                    default_operator=SearchOperator.CONTAINS if field_type == DataType.STRING else SearchOperator.EQUALS
                ))
        
        if basic_fields:
            filter_groups.append(FilterGroup(
                name="basic",
                display_name="Basic Information",
                filters=basic_fields
            ))
        
        # Status and Category Group
        status_fields = []
        status_keywords = ["status", "type", "level", "role", "department", "industry"]
        
        for field, field_type in searchable_fields.items():
            if any(keyword in field.lower() for keyword in status_keywords):
                operators = [SearchOperator.EQUALS, SearchOperator.NOT_EQUALS, SearchOperator.IN]
                
                # Get options for categorical fields
                options = await get_field_options(entity, field, mining_engine)
                
                status_fields.append(FilterDefinition(
                    field=field,
                    field_type=field_type,
                    display_name=field.replace("_", " ").title(),
                    operators=operators,
                    options=options
                ))
        
        if status_fields:
            filter_groups.append(FilterGroup(
                name="categories",
                display_name="Categories & Status",
                filters=status_fields
            ))
        
        # Numeric and Range Group
        numeric_fields = []
        numeric_keywords = ["score", "count", "number", "amount", "rate", "gpa", "experience", "students"]
        
        for field, field_type in searchable_fields.items():
            if (field_type in [DataType.INTEGER, DataType.FLOAT] or 
                any(keyword in field.lower() for keyword in numeric_keywords)):
                
                operators = [
                    SearchOperator.EQUALS, SearchOperator.NOT_EQUALS,
                    SearchOperator.GREATER_THAN, SearchOperator.GREATER_EQUAL,
                    SearchOperator.LESS_THAN, SearchOperator.LESS_EQUAL,
                    SearchOperator.BETWEEN
                ]
                
                # Get min/max values
                min_val, max_val = await get_field_range(entity, field, mining_engine)
                
                numeric_fields.append(FilterDefinition(
                    field=field,
                    field_type=field_type,
                    display_name=field.replace("_", " ").title(),
                    operators=operators,
                    min_value=min_val,
                    max_value=max_val,
                    default_operator=SearchOperator.GREATER_EQUAL
                ))
        
        if numeric_fields:
            filter_groups.append(FilterGroup(
                name="numeric",
                display_name="Numeric & Ranges",
                filters=numeric_fields
            ))
        
        # Date and Time Group
        date_fields = []
        date_keywords = ["date", "time", "created", "updated", "start", "end"]
        
        for field, field_type in searchable_fields.items():
            if (field_type in [DataType.DATE, DataType.DATETIME] or
                any(keyword in field.lower() for keyword in date_keywords)):
                
                operators = [
                    SearchOperator.EQUALS, SearchOperator.GREATER_THAN,
                    SearchOperator.GREATER_EQUAL, SearchOperator.LESS_THAN,
                    SearchOperator.LESS_EQUAL, SearchOperator.BETWEEN
                ]
                
                date_fields.append(FilterDefinition(
                    field=field,
                    field_type=field_type,
                    display_name=field.replace("_", " ").title(),
                    operators=operators,
                    default_operator=SearchOperator.GREATER_EQUAL
                ))
        
        if date_fields:
            filter_groups.append(FilterGroup(
                name="dates",
                display_name="Dates & Time",
                filters=date_fields
            ))
        
        # Advanced Group (JSON, Arrays, etc.)
        advanced_fields = []
        for field, field_type in searchable_fields.items():
            if field_type in [DataType.JSON, DataType.ARRAY]:
                operators = [SearchOperator.CONTAINS, SearchOperator.NOT_CONTAINS]
                
                advanced_fields.append(FilterDefinition(
                    field=field,
                    field_type=field_type,
                    display_name=field.replace("_", " ").title(),
                    operators=operators
                ))
        
        if advanced_fields:
            filter_groups.append(FilterGroup(
                name="advanced",
                display_name="Advanced Fields",
                filters=advanced_fields
            ))
        
        return {
            "entity": entity,
            "filter_groups": filter_groups,
            "total_filters": sum(len(group.filters) for group in filter_groups)
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get filter definitions: {str(e)}")


@router.get("/presets/{entity}")
async def get_filter_presets(entity: str):
    """
    Get predefined filter presets for common use cases
    """
    presets = {
        "students": [
            FilterPreset(
                name="active_students",
                display_name="Active Students",
                description="Students currently enrolled",
                entity="students",
                filters=[
                    FilterCondition(field="status", operator=SearchOperator.EQUALS, value="active", data_type=DataType.STRING)
                ],
                sort=[SortCondition(field="gpa", order=SortOrder.DESC)]
            ),
            FilterPreset(
                name="high_performers",
                display_name="High Performers",
                description="Students with GPA >= 3.5",
                entity="students",
                filters=[
                    FilterCondition(field="gpa", operator=SearchOperator.GREATER_EQUAL, value=3.5, data_type=DataType.FLOAT),
                    FilterCondition(field="status", operator=SearchOperator.EQUALS, value="active", data_type=DataType.STRING)
                ],
                sort=[SortCondition(field="gpa", order=SortOrder.DESC)]
            ),
            FilterPreset(
                name="graduating_soon",
                display_name="Graduating Soon",
                description="Students graduating within 6 months",
                entity="students",
                filters=[
                    FilterCondition(field="expected_graduation_date", operator=SearchOperator.LESS_EQUAL, 
                                  value=(datetime.now().date().replace(month=datetime.now().month + 6)).isoformat(), 
                                  data_type=DataType.DATE)
                ]
            )
        ],
        "mentors": [
            FilterPreset(
                name="available_mentors",
                display_name="Available Mentors",
                description="Mentors with capacity for more students",
                entity="mentors",
                filters=[
                    FilterCondition(field="status", operator=SearchOperator.EQUALS, value="active", data_type=DataType.STRING)
                ]
            ),
            FilterPreset(
                name="senior_mentors",
                display_name="Senior Mentors",
                description="Mentors with 5+ years experience",
                entity="mentors",
                filters=[
                    FilterCondition(field="years_of_experience", operator=SearchOperator.GREATER_EQUAL, value=5, data_type=DataType.INTEGER)
                ],
                sort=[SortCondition(field="years_of_experience", order=SortOrder.DESC)]
            )
        ],
        "projects": [
            FilterPreset(
                name="open_projects",
                display_name="Open Projects",
                description="Projects accepting applications",
                entity="projects",
                filters=[
                    FilterCondition(field="status", operator=SearchOperator.EQUALS, value="open", data_type=DataType.STRING)
                ]
            ),
            FilterPreset(
                name="beginner_friendly",
                display_name="Beginner Friendly",
                description="Entry-level projects",
                entity="projects",
                filters=[
                    FilterCondition(field="difficulty_level", operator=SearchOperator.IN, value=["beginner", "easy"], data_type=DataType.STRING)
                ]
            ),
            FilterPreset(
                name="starting_soon",
                display_name="Starting Soon",
                description="Projects starting within 30 days",
                entity="projects",
                filters=[
                    FilterCondition(field="start_date", operator=SearchOperator.LESS_EQUAL, 
                                  value=(datetime.now().date().replace(day=datetime.now().day + 30)).isoformat(), 
                                  data_type=DataType.DATE)
                ]
            )
        ]
    }
    
    return {
        "entity": entity,
        "presets": presets.get(entity, []),
        "total_presets": len(presets.get(entity, []))
    }


@router.post("/suggestions")
async def get_filter_suggestions(
    entity: str = Query(..., description="Entity to analyze"),
    current_filters: List[FilterCondition] = [],
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get intelligent filter suggestions based on data analysis
    """
    try:
        suggestions = []
        
        # Analyze current data to suggest useful filters
        query = SearchQuery(
            entity=entity,
            filters=current_filters,
            page=1,
            page_size=1,
            include_relations=False
        )
        
        result = await mining_engine.search(query)
        
        # Suggest filters based on entity type and common patterns
        if entity == "students":
            suggestions.extend([
                FilterSuggestion(
                    field="status",
                    operator=SearchOperator.EQUALS,
                    suggested_values=["active", "inactive", "graduated"],
                    description="Filter by student enrollment status"
                ),
                FilterSuggestion(
                    field="gpa",
                    operator=SearchOperator.GREATER_EQUAL,
                    suggested_values=[3.0, 3.5, 3.8],
                    description="Filter by academic performance"
                ),
                FilterSuggestion(
                    field="program",
                    operator=SearchOperator.EQUALS,
                    suggested_values=await get_common_values(entity, "program", mining_engine),
                    description="Filter by academic program"
                )
            ])
        
        elif entity == "projects":
            suggestions.extend([
                FilterSuggestion(
                    field="status",
                    operator=SearchOperator.EQUALS,
                    suggested_values=["open", "in_progress", "completed"],
                    description="Filter by project status"
                ),
                FilterSuggestion(
                    field="difficulty_level",
                    operator=SearchOperator.EQUALS,
                    suggested_values=["beginner", "intermediate", "advanced"],
                    description="Filter by project difficulty"
                ),
                FilterSuggestion(
                    field="project_type",
                    operator=SearchOperator.EQUALS,
                    suggested_values=await get_common_values(entity, "project_type", mining_engine),
                    description="Filter by project category"
                )
            ])
        
        elif entity == "mentors":
            suggestions.extend([
                FilterSuggestion(
                    field="industry",
                    operator=SearchOperator.EQUALS,
                    suggested_values=await get_common_values(entity, "industry", mining_engine),
                    description="Filter by industry expertise"
                ),
                FilterSuggestion(
                    field="years_of_experience",
                    operator=SearchOperator.GREATER_EQUAL,
                    suggested_values=[2, 5, 10],
                    description="Filter by experience level"
                )
            ])
        
        return {
            "entity": entity,
            "suggestions": suggestions,
            "total_suggestions": len(suggestions),
            "current_result_count": result.total_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate suggestions: {str(e)}")


@router.get("/values/{entity}/{field}")
async def get_field_values(
    entity: str,
    field: str,
    limit: int = Query(50, ge=1, le=200, description="Maximum values to return"),
    search: Optional[str] = Query(None, description="Search within values"),
    mining_engine: DataMiningEngine = Depends(get_mining_engine)
):
    """
    Get distinct values for a specific field with optional search
    """
    try:
        # This would typically use a more efficient database query
        # For now, we'll simulate with common values
        
        common_values = {
            ("students", "status"): ["active", "inactive", "graduated", "withdrawn"],
            ("students", "program"): ["Computer Science", "Business Administration", "Engineering", "MBA"],
            ("students", "specialization"): ["Software Development", "Data Science", "Cybersecurity", "AI/ML"],
            ("mentors", "industry"): ["Technology", "Finance", "Healthcare", "Manufacturing", "Consulting"],
            ("mentors", "job_title"): ["Software Engineer", "Data Scientist", "Product Manager", "CTO", "VP Engineering"],
            ("projects", "status"): ["open", "in_progress", "completed", "cancelled"],
            ("projects", "difficulty_level"): ["beginner", "intermediate", "advanced"],
            ("projects", "project_type"): ["web_development", "mobile_app", "data_analysis", "ai_ml", "research"],
            ("companies", "size"): ["startup", "small", "medium", "large", "enterprise"],
            ("companies", "industry"): ["Technology", "Finance", "Healthcare", "Manufacturing", "Retail"]
        }
        
        values = common_values.get((entity, field), [])
        
        # Apply search filter if provided
        if search:
            values = [v for v in values if search.lower() in v.lower()]
        
        # Limit results
        values = values[:limit]
        
        return {
            "entity": entity,
            "field": field,
            "values": [{"value": v, "label": v.replace("_", " ").title()} for v in values],
            "total_count": len(values),
            "has_more": len(values) == limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get field values: {str(e)}")


async def get_field_options(entity: str, field: str, mining_engine: DataMiningEngine) -> List[FilterOption]:
    """Get predefined options for categorical fields"""
    # This would typically query the database for distinct values
    # For now, return common options based on field name
    
    options_map = {
        "status": ["active", "inactive", "completed", "cancelled"],
        "difficulty_level": ["beginner", "intermediate", "advanced"],
        "project_type": ["web_development", "mobile_app", "data_analysis", "ai_ml"],
        "industry": ["Technology", "Finance", "Healthcare", "Manufacturing"],
        "role": ["admin", "student", "mentor", "company_rep"],
        "size": ["startup", "small", "medium", "large", "enterprise"]
    }
    
    field_lower = field.lower()
    for key, values in options_map.items():
        if key in field_lower:
            return [FilterOption(label=v.replace("_", " ").title(), value=v) for v in values]
    
    return None


async def get_field_range(entity: str, field: str, mining_engine: DataMiningEngine) -> tuple:
    """Get min/max range for numeric fields"""
    # This would typically query the database for actual min/max
    # For now, return reasonable defaults based on field name
    
    ranges = {
        "gpa": (0.0, 4.0),
        "years_of_experience": (0, 50),
        "max_students": (1, 20),
        "current_students": (0, 20),
        "duration_weeks": (1, 52),
        "score": (0.0, 100.0),
        "rate": (0.0, 1.0)
    }
    
    field_lower = field.lower()
    for key, (min_val, max_val) in ranges.items():
        if key in field_lower:
            return min_val, max_val
    
    return None, None


async def get_common_values(entity: str, field: str, mining_engine: DataMiningEngine) -> List[str]:
    """Get most common values for a field"""
    # This would typically use database aggregation
    # For now, return predefined common values
    
    common_values = {
        ("students", "program"): ["Computer Science", "Business Administration", "Engineering"],
        ("students", "specialization"): ["Software Development", "Data Science", "Cybersecurity"],
        ("mentors", "industry"): ["Technology", "Finance", "Healthcare"],
        ("projects", "project_type"): ["web_development", "mobile_app", "data_analysis"],
        ("companies", "industry"): ["Technology", "Finance", "Healthcare"]
    }
    
    return common_values.get((entity, field), [])


@router.get("/health")
async def filter_health_check():
    """Health check for filtering service"""
    return {
        "status": "healthy",
        "service": "Advanced Filtering",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Filter Definitions", "Filter Presets", "Value Suggestions",
            "Field Options", "Range Detection", "Smart Recommendations"
        ]
    }