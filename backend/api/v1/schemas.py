"""
Pydantic schemas for SMART Connect API
Request and response models for all endpoints
"""
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, validator
from enum import Enum


# Enums
class UserRole(str, Enum):
    ADMIN = "Admin"
    MENTOR = "Mentor"
    STUDENT = "Student"


class StudentStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class MentorStatus(str, Enum):
    ACTIVE = "Active"
    AVAILABLE = "Available"
    INACTIVE = "Inactive"


class ProjectStatus(str, Enum):
    NOT_ASSIGNED = "Not Assigned"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"


class SurveyStatus(str, Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"


# Base schemas
class BaseUser(BaseModel):
    email: EmailStr
    role: UserRole
    full_name: Optional[str] = None
    profile_photo_url: Optional[str] = None


class UserCreate(BaseUser):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_photo_url: Optional[str] = None


class UserResponse(BaseUser):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Student schemas
class StudentCreate(BaseModel):
    student_id_number: Optional[str] = None
    gpa: Optional[float] = None
    program: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[Dict[str, Any]] = None
    registration_date: Optional[date] = None


class StudentUpdate(BaseModel):
    student_id_number: Optional[str] = None
    gpa: Optional[float] = None
    program: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[Dict[str, Any]] = None
    status: Optional[StudentStatus] = None


class StudentResponse(BaseModel):
    user_id: int
    student_id_number: Optional[str]
    gpa: Optional[float]
    program: Optional[str]
    resume_text: Optional[str]
    skills: Optional[Dict[str, Any]]
    status: StudentStatus
    registration_date: Optional[date]
    user: UserResponse
    
    class Config:
        from_attributes = True


# Mentor schemas
class MentorCreate(BaseModel):
    skills: Optional[Dict[str, Any]] = None
    past_projects: Optional[Dict[str, Any]] = None


class MentorUpdate(BaseModel):
    skills: Optional[Dict[str, Any]] = None
    past_projects: Optional[Dict[str, Any]] = None
    status: Optional[MentorStatus] = None


class MentorResponse(BaseModel):
    user_id: int
    skills: Optional[Dict[str, Any]]
    past_projects: Optional[Dict[str, Any]]
    status: MentorStatus
    user: UserResponse
    
    class Config:
        from_attributes = True


# Company schemas
class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    website_url: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_person_email: Optional[EmailStr] = None


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_person_email: Optional[EmailStr] = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: Optional[str]
    website_url: Optional[str]
    contact_person_name: Optional[str]
    contact_person_email: Optional[str]
    
    class Config:
        from_attributes = True


# Project schemas
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    company_id: Optional[int] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    company_id: Optional[int] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    company_id: Optional[int]
    status: ProjectStatus
    start_date: Optional[date]
    completion_date: Optional[date]
    company: Optional[CompanyResponse]
    
    class Config:
        from_attributes = True


# Course schemas
class CourseCreate(BaseModel):
    title: str
    code: Optional[str] = None
    schedule: Optional[str] = None
    delivery_method: Optional[str] = None
    mentor_id: Optional[int] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    schedule: Optional[str] = None
    delivery_method: Optional[str] = None
    mentor_id: Optional[int] = None


class CourseResponse(BaseModel):
    id: int
    title: str
    code: Optional[str]
    schedule: Optional[str]
    delivery_method: Optional[str]
    mentor_id: Optional[int]
    mentor: Optional[UserResponse]
    
    class Config:
        from_attributes = True


# Survey schemas
class SurveyCreate(BaseModel):
    title: str
    type: Optional[str] = None
    due_date: Optional[date] = None


class SurveyUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    status: Optional[SurveyStatus] = None
    due_date: Optional[date] = None


class SurveyResponse(BaseModel):
    id: int
    title: str
    type: Optional[str]
    status: SurveyStatus
    due_date: Optional[date]
    
    class Config:
        from_attributes = True


class SurveyResponseCreate(BaseModel):
    survey_id: int
    response_data: Dict[str, Any]


class SurveyResponseResponse(BaseModel):
    id: int
    survey_id: int
    user_id: int
    response_data: Dict[str, Any]
    survey: SurveyResponse
    user: UserResponse
    
    class Config:
        from_attributes = True


# AI-specific schemas
class StudentRankingRequest(BaseModel):
    project_id: Optional[int] = None
    criteria: Optional[Dict[str, Any]] = None
    limit: Optional[int] = 10


class StudentRankingResponse(BaseModel):
    students: List[Dict[str, Any]]
    criteria_used: Dict[str, Any]
    ai_provider: str
    processing_time: float
    cost: float


class ProjectMatchingRequest(BaseModel):
    student_id: int
    preferences: Optional[Dict[str, Any]] = None
    limit: Optional[int] = 5


class ProjectMatchingResponse(BaseModel):
    projects: List[Dict[str, Any]]
    match_scores: Dict[int, float]
    ai_provider: str
    processing_time: float
    cost: float


class SkillExtractionRequest(BaseModel):
    resume_text: str
    additional_context: Optional[str] = None


class SkillExtractionResponse(BaseModel):
    extracted_skills: Dict[str, Any]
    confidence_scores: Dict[str, float]
    ai_provider: str
    processing_time: float
    cost: float


# Generic response schemas
class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    success: bool = False


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int