"""
Advanced Search and Data Mining Engine
MIT License - Westcliff University Property
"""

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, date
from sqlalchemy import and_, or_, text, func, desc, asc
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel, Field
import json
import re
from enum import Enum

from ..models.student import Student
from ..models.mentor import Mentor
from ..models.project import Project
from ..models.company import Company
from ..models.survey import Survey, SurveyResponse
from ..models.user import User
from ..models.course import Course


class SearchOperator(str, Enum):
    EQUALS = "equals"
    NOT_EQUALS = "not_equals"
    CONTAINS = "contains"
    NOT_CONTAINS = "not_contains"
    STARTS_WITH = "starts_with"
    ENDS_WITH = "ends_with"
    GREATER_THAN = "gt"
    GREATER_EQUAL = "gte"
    LESS_THAN = "lt"
    LESS_EQUAL = "lte"
    BETWEEN = "between"
    IN = "in"
    NOT_IN = "not_in"
    IS_NULL = "is_null"
    IS_NOT_NULL = "is_not_null"
    REGEX = "regex"
    FULL_TEXT = "full_text"


class DataType(str, Enum):
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    JSON = "json"
    ARRAY = "array"


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"


class FilterCondition(BaseModel):
    field: str
    operator: SearchOperator
    value: Any
    data_type: DataType = DataType.STRING


class SortCondition(BaseModel):
    field: str
    order: SortOrder = SortOrder.ASC


class SearchQuery(BaseModel):
    entity: str  # students, mentors, projects, companies, surveys, users, courses
    filters: List[FilterCondition] = Field(default_factory=list)
    search_text: Optional[str] = None
    search_fields: List[str] = Field(default_factory=list)
    sort: List[SortCondition] = Field(default_factory=list)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    include_relations: bool = True
    aggregate_functions: Dict[str, str] = Field(default_factory=dict)


class SearchResult(BaseModel):
    data: List[Dict[str, Any]]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    aggregations: Dict[str, Any] = Field(default_factory=dict)
    execution_time_ms: float
    query_info: Dict[str, Any] = Field(default_factory=dict)


class DataMiningEngine:
    """Advanced database mining and search engine"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.entity_models = {
            "students": Student,
            "mentors": Mentor,
            "projects": Project,
            "companies": Company,
            "surveys": Survey,
            "survey_responses": SurveyResponse,
            "users": User,
            "courses": Course
        }
        self.searchable_fields = self._initialize_searchable_fields()
        self.full_text_fields = self._initialize_full_text_fields()
    
    def _initialize_searchable_fields(self) -> Dict[str, Dict[str, DataType]]:
        """Initialize searchable fields for each entity"""
        return {
            "students": {
                "student_id": DataType.STRING,
                "program": DataType.STRING,
                "specialization": DataType.STRING,
                "gpa": DataType.FLOAT,
                "status": DataType.STRING,
                "enrollment_date": DataType.DATE,
                "expected_graduation_date": DataType.DATE,
                "skills": DataType.JSON,
                "interests": DataType.JSON,
                "ai_ranking_score": DataType.FLOAT,
                "created_at": DataType.DATETIME,
                "updated_at": DataType.DATETIME
            },
            "mentors": {
                "company_name": DataType.STRING,
                "job_title": DataType.STRING,
                "department": DataType.STRING,
                "industry": DataType.STRING,
                "years_of_experience": DataType.INTEGER,
                "expertise_areas": DataType.JSON,
                "skills": DataType.JSON,
                "status": DataType.STRING,
                "max_students": DataType.INTEGER,
                "current_students": DataType.INTEGER,
                "created_at": DataType.DATETIME
            },
            "projects": {
                "title": DataType.STRING,
                "description": DataType.STRING,
                "project_type": DataType.STRING,
                "difficulty_level": DataType.STRING,
                "status": DataType.STRING,
                "start_date": DataType.DATE,
                "end_date": DataType.DATE,
                "duration_weeks": DataType.INTEGER,
                "max_students": DataType.INTEGER,
                "current_students": DataType.INTEGER,
                "required_skills": DataType.JSON,
                "preferred_skills": DataType.JSON,
                "technologies": DataType.JSON,
                "ai_matching_score": DataType.FLOAT,
                "created_at": DataType.DATETIME
            },
            "companies": {
                "name": DataType.STRING,
                "industry": DataType.STRING,
                "size": DataType.STRING,
                "description": DataType.STRING,
                "status": DataType.STRING,
                "founded_year": DataType.INTEGER,
                "partnership_level": DataType.STRING,
                "technologies_used": DataType.JSON,
                "preferred_skills": DataType.JSON,
                "created_at": DataType.DATETIME
            },
            "surveys": {
                "title": DataType.STRING,
                "survey_type": DataType.STRING,
                "target_audience": DataType.STRING,
                "status": DataType.STRING,
                "start_date": DataType.DATE,
                "end_date": DataType.DATE,
                "is_anonymous": DataType.BOOLEAN,
                "is_mandatory": DataType.BOOLEAN,
                "max_responses": DataType.INTEGER,
                "current_responses": DataType.INTEGER,
                "response_rate": DataType.FLOAT,
                "created_at": DataType.DATETIME
            },
            "users": {
                "email": DataType.STRING,
                "first_name": DataType.STRING,
                "last_name": DataType.STRING,
                "role": DataType.STRING,
                "is_active": DataType.BOOLEAN,
                "email_verified": DataType.BOOLEAN,
                "created_at": DataType.DATETIME,
                "last_login": DataType.DATETIME
            },
            "courses": {
                "course_code": DataType.STRING,
                "course_name": DataType.STRING,
                "description": DataType.STRING,
                "credits": DataType.INTEGER,
                "department": DataType.STRING,
                "level": DataType.STRING,
                "skills_covered": DataType.JSON,
                "is_capstone_eligible": DataType.BOOLEAN,
                "status": DataType.STRING,
                "created_at": DataType.DATETIME
            }
        }
    
    def _initialize_full_text_fields(self) -> Dict[str, List[str]]:
        """Initialize full-text searchable fields"""
        return {
            "students": ["resume_text", "career_goals", "first_name", "last_name"],
            "mentors": ["bio", "first_name", "last_name", "job_title"],
            "projects": ["title", "description", "learning_objectives", "success_criteria"],
            "companies": ["name", "description", "company_culture"],
            "surveys": ["title", "description"],
            "users": ["first_name", "last_name", "email"],
            "courses": ["course_name", "description"]
        }
    
    async def search(self, query: SearchQuery) -> SearchResult:
        """Execute advanced search query"""
        start_time = datetime.now()
        
        # Get the model class
        if query.entity not in self.entity_models:
            raise ValueError(f"Unknown entity: {query.entity}")
        
        model_class = self.entity_models[query.entity]
        
        # Build the base query
        db_query = self.db.query(model_class)
        
        # Add relations if requested
        if query.include_relations:
            db_query = self._add_relations(db_query, query.entity)
        
        # Apply filters
        for filter_condition in query.filters:
            db_query = self._apply_filter(db_query, model_class, filter_condition)
        
        # Apply full-text search
        if query.search_text:
            db_query = self._apply_full_text_search(
                db_query, model_class, query.entity, 
                query.search_text, query.search_fields
            )
        
        # Get total count before pagination
        total_count = db_query.count()
        
        # Apply sorting
        for sort_condition in query.sort:
            db_query = self._apply_sorting(db_query, model_class, sort_condition)
        
        # Apply pagination
        offset = (query.page - 1) * query.page_size
        db_query = db_query.offset(offset).limit(query.page_size)
        
        # Execute query
        results = db_query.all()
        
        # Calculate aggregations if requested
        aggregations = {}
        if query.aggregate_functions:
            aggregations = await self._calculate_aggregations(
                model_class, query.filters, query.aggregate_functions
            )
        
        # Convert results to dictionaries
        data = [self._model_to_dict(result) for result in results]
        
        execution_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return SearchResult(
            data=data,
            total_count=total_count,
            page=query.page,
            page_size=query.page_size,
            total_pages=(total_count + query.page_size - 1) // query.page_size,
            aggregations=aggregations,
            execution_time_ms=execution_time,
            query_info={
                "entity": query.entity,
                "filters_applied": len(query.filters),
                "full_text_search": bool(query.search_text),
                "relations_included": query.include_relations
            }
        )
    
    def _add_relations(self, query, entity: str):
        """Add related models to query"""
        if entity == "students":
            query = query.options(joinedload(Student.user))
        elif entity == "mentors":
            query = query.options(joinedload(Mentor.user))
        elif entity == "projects":
            query = query.options(
                joinedload(Project.company),
                joinedload(Project.mentor)
            )
        elif entity == "survey_responses":
            query = query.options(
                joinedload(SurveyResponse.survey),
                joinedload(SurveyResponse.user)
            )
        
        return query
    
    def _apply_filter(self, query, model_class, filter_condition: FilterCondition):
        """Apply a single filter condition"""
        field_attr = getattr(model_class, filter_condition.field, None)
        if field_attr is None:
            return query
        
        value = self._convert_value(filter_condition.value, filter_condition.data_type)
        
        if filter_condition.operator == SearchOperator.EQUALS:
            return query.filter(field_attr == value)
        elif filter_condition.operator == SearchOperator.NOT_EQUALS:
            return query.filter(field_attr != value)
        elif filter_condition.operator == SearchOperator.CONTAINS:
            return query.filter(field_attr.contains(value))
        elif filter_condition.operator == SearchOperator.NOT_CONTAINS:
            return query.filter(~field_attr.contains(value))
        elif filter_condition.operator == SearchOperator.STARTS_WITH:
            return query.filter(field_attr.startswith(value))
        elif filter_condition.operator == SearchOperator.ENDS_WITH:
            return query.filter(field_attr.endswith(value))
        elif filter_condition.operator == SearchOperator.GREATER_THAN:
            return query.filter(field_attr > value)
        elif filter_condition.operator == SearchOperator.GREATER_EQUAL:
            return query.filter(field_attr >= value)
        elif filter_condition.operator == SearchOperator.LESS_THAN:
            return query.filter(field_attr < value)
        elif filter_condition.operator == SearchOperator.LESS_EQUAL:
            return query.filter(field_attr <= value)
        elif filter_condition.operator == SearchOperator.BETWEEN:
            if isinstance(value, list) and len(value) == 2:
                return query.filter(field_attr.between(value[0], value[1]))
        elif filter_condition.operator == SearchOperator.IN:
            if isinstance(value, list):
                return query.filter(field_attr.in_(value))
        elif filter_condition.operator == SearchOperator.NOT_IN:
            if isinstance(value, list):
                return query.filter(~field_attr.in_(value))
        elif filter_condition.operator == SearchOperator.IS_NULL:
            return query.filter(field_attr.is_(None))
        elif filter_condition.operator == SearchOperator.IS_NOT_NULL:
            return query.filter(field_attr.isnot(None))
        elif filter_condition.operator == SearchOperator.REGEX:
            return query.filter(field_attr.op('~')(value))
        elif filter_condition.operator == SearchOperator.FULL_TEXT:
            # PostgreSQL full-text search
            return query.filter(
                func.to_tsvector('english', field_attr).match(value)
            )
        
        return query
    
    def _apply_full_text_search(self, query, model_class, entity: str, 
                               search_text: str, search_fields: List[str]):
        """Apply full-text search across specified fields"""
        if not search_text:
            return query
        
        # Get searchable fields for this entity
        entity_search_fields = self.full_text_fields.get(entity, [])
        
        # Use specified fields or default to all searchable fields
        fields_to_search = search_fields if search_fields else entity_search_fields
        
        search_conditions = []
        
        for field_name in fields_to_search:
            field_attr = getattr(model_class, field_name, None)
            if field_attr is not None:
                # Add different search patterns
                search_conditions.extend([
                    field_attr.ilike(f"%{search_text}%"),
                    func.to_tsvector('english', field_attr).match(search_text)
                ])
        
        # Join all conditions with OR
        if search_conditions:
            query = query.filter(or_(*search_conditions))
        
        return query
    
    def _apply_sorting(self, query, model_class, sort_condition: SortCondition):
        """Apply sorting to query"""
        field_attr = getattr(model_class, sort_condition.field, None)
        if field_attr is None:
            return query
        
        if sort_condition.order == SortOrder.DESC:
            return query.order_by(desc(field_attr))
        else:
            return query.order_by(asc(field_attr))
    
    async def _calculate_aggregations(self, model_class, filters: List[FilterCondition], 
                                    aggregate_functions: Dict[str, str]) -> Dict[str, Any]:
        """Calculate aggregation functions"""
        aggregations = {}
        
        # Build base query with filters
        base_query = self.db.query(model_class)
        for filter_condition in filters:
            base_query = self._apply_filter(base_query, model_class, filter_condition)
        
        for field_name, function in aggregate_functions.items():
            field_attr = getattr(model_class, field_name, None)
            if field_attr is None:
                continue
            
            try:
                if function == "count":
                    result = base_query.count()
                elif function == "avg":
                    result = self.db.query(func.avg(field_attr)).filter(
                        base_query.whereclause if hasattr(base_query, 'whereclause') else True
                    ).scalar()
                elif function == "sum":
                    result = self.db.query(func.sum(field_attr)).filter(
                        base_query.whereclause if hasattr(base_query, 'whereclause') else True
                    ).scalar()
                elif function == "min":
                    result = self.db.query(func.min(field_attr)).filter(
                        base_query.whereclause if hasattr(base_query, 'whereclause') else True
                    ).scalar()
                elif function == "max":
                    result = self.db.query(func.max(field_attr)).filter(
                        base_query.whereclause if hasattr(base_query, 'whereclause') else True
                    ).scalar()
                else:
                    continue
                
                aggregations[f"{field_name}_{function}"] = result
            except Exception as e:
                # Log error but continue
                aggregations[f"{field_name}_{function}"] = None
        
        return aggregations
    
    def _convert_value(self, value: Any, data_type: DataType) -> Any:
        """Convert value to appropriate type"""
        if value is None:
            return None
        
        try:
            if data_type == DataType.INTEGER:
                return int(value)
            elif data_type == DataType.FLOAT:
                return float(value)
            elif data_type == DataType.BOOLEAN:
                if isinstance(value, str):
                    return value.lower() in ('true', '1', 'yes', 'on')
                return bool(value)
            elif data_type == DataType.DATE:
                if isinstance(value, str):
                    return datetime.strptime(value, "%Y-%m-%d").date()
                return value
            elif data_type == DataType.DATETIME:
                if isinstance(value, str):
                    return datetime.fromisoformat(value.replace('Z', '+00:00'))
                return value
            elif data_type == DataType.JSON:
                if isinstance(value, str):
                    return json.loads(value)
                return value
            elif data_type == DataType.ARRAY:
                if isinstance(value, str):
                    return value.split(',')
                return value if isinstance(value, list) else [value]
            else:  # STRING
                return str(value)
        except (ValueError, TypeError):
            return value
    
    def _model_to_dict(self, model) -> Dict[str, Any]:
        """Convert SQLAlchemy model to dictionary"""
        result = {}
        
        # Get all columns
        for column in model.__table__.columns:
            value = getattr(model, column.name)
            if isinstance(value, (date, datetime)):
                result[column.name] = value.isoformat()
            else:
                result[column.name] = value
        
        # Add relationships
        for relationship in model.__mapper__.relationships:
            if hasattr(model, relationship.key):
                related_obj = getattr(model, relationship.key)
                if related_obj is not None:
                    if hasattr(related_obj, '__iter__') and not isinstance(related_obj, str):
                        # One-to-many relationship
                        result[relationship.key] = [
                            self._model_to_dict(obj) for obj in related_obj
                        ]
                    else:
                        # One-to-one relationship
                        result[relationship.key] = self._model_to_dict(related_obj)
        
        return result
    
    def get_entity_schema(self, entity: str) -> Dict[str, Any]:
        """Get searchable schema for an entity"""
        if entity not in self.searchable_fields:
            raise ValueError(f"Unknown entity: {entity}")
        
        return {
            "entity": entity,
            "searchable_fields": self.searchable_fields[entity],
            "full_text_fields": self.full_text_fields.get(entity, []),
            "supported_operators": [op.value for op in SearchOperator],
            "supported_data_types": [dt.value for dt in DataType]
        }
