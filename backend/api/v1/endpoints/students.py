"""
Student endpoints for SMART Connect
CRUD operations for students
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from core.database import get_db
from core.security import get_current_user, get_current_admin, get_current_mentor
from models.user import User
from models.student import Student
from api.v1.schemas import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    MessageResponse,
    PaginatedResponse
)

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/", response_model=List[StudentResponse])
async def get_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    program: Optional[str] = Query(None),
    current_user: User = Depends(get_current_mentor),  # Mentors and admins can view
    db: Session = Depends(get_db)
):
    """Get list of students"""
    
    query = db.query(Student).options(joinedload(Student.user))
    
    if status:
        query = query.filter(Student.status == status)
    
    if program:
        query = query.filter(Student.program.ilike(f"%{program}%"))
    
    students = query.offset(skip).limit(limit).all()
    return students


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific student by ID"""
    
    student = db.query(Student).options(joinedload(Student.user)).filter(
        Student.user_id == student_id
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Students can only view their own profile, mentors and admins can view any
    if current_user.role == "Student" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return student


@router.post("/", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create student profile (students create their own profile)"""
    
    # Check if user is a student and creating their own profile
    if current_user.role != "Student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create student profiles"
        )
    
    # Check if student profile already exists
    existing_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student profile already exists"
        )
    
    # Create student profile
    db_student = Student(
        user_id=current_user.id,
        **student_data.dict()
    )
    
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_data: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student profile"""
    
    student = db.query(Student).filter(Student.user_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Students can only update their own profile, admins can update any
    if current_user.role == "Student" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    elif current_user.role == "Mentor":
        # Mentors can only update status
        update_data = {"status": student_data.status} if student_data.status else {}
    else:
        # Admins can update everything
        update_data = student_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    
    return student


@router.delete("/{student_id}", response_model=MessageResponse)
async def delete_student(
    student_id: int,
    current_user: User = Depends(get_current_admin),  # Only admins can delete
    db: Session = Depends(get_db)
):
    """Delete student profile"""
    
    student = db.query(Student).filter(Student.user_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db.delete(student)
    db.commit()
    
    return {
        "message": "Student profile deleted successfully",
        "success": True
    }


@router.get("/{student_id}/projects")
async def get_student_projects(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get projects assigned to a student"""
    
    # Check permissions
    if current_user.role == "Student" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    student = db.query(Student).filter(Student.user_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Get projects through the many-to-many relationship
    from models.project import ProjectStudent, Project
    
    project_assignments = db.query(ProjectStudent).filter(
        ProjectStudent.student_user_id == student_id
    ).all()
    
    projects = []
    for assignment in project_assignments:
        project = db.query(Project).filter(Project.id == assignment.project_id).first()
        if project:
            projects.append(project)
    
    return projects
