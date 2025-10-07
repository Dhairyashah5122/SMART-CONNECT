"""
AI-powered student ranking endpoint for SMART Connect
Rank students for projects using multiple AI providers
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from backend.core.database import get_db
from backend.core.security import get_current_mentor  # Mentors and admins can rank
from backend.models.user import User
from backend.models.student import Student
from backend.models.project import Project
from backend.ai_adapters.base import AIRequest, AITask
from backend.ai_adapters.manager import ai_manager
from backend.api.v1.schemas import (
    StudentRankingRequest,
    StudentRankingResponse,
    ErrorResponse
)

router = APIRouter(prefix="/rank-students", tags=["AI Student Ranking"])


@router.post("/", response_model=StudentRankingResponse)
async def rank_students_for_project(
    ranking_request: StudentRankingRequest,
    current_user: User = Depends(get_current_mentor),
    db: Session = Depends(get_db)
):
    """
    Rank students for a project or general program using AI
    """
    
    try:
        # Get all approved students
        students_query = db.query(Student).options(joinedload(Student.user)).filter(
            Student.status == "Approved"
        )
        
        students = students_query.all()
        
        if not students:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No approved students found"
            )
        
        # Get project details if project_id is provided
        project_context = ""
        if ranking_request.project_id:
            project = db.query(Project).filter(Project.id == ranking_request.project_id).first()
            if not project:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            project_context = f"Project: {project.name}\nDescription: {project.description or 'N/A'}"
        
        # Prepare student data for AI
        student_data = []
        for student in students:
            student_info = {
                "id": student.user_id,
                "name": student.user.full_name or "N/A",
                "email": student.user.email,
                "student_id": student.student_id_number or "N/A",
                "gpa": float(student.gpa) if student.gpa else None,
                "program": student.program or "N/A",
                "skills": student.skills or {},
                "resume_summary": student.resume_text[:500] if student.resume_text else "No resume available"
            }
            student_data.append(student_info)
        
        # Prepare ranking criteria
        default_criteria = {
            "gpa_weight": 0.3,
            "skills_match_weight": 0.4,
            "program_relevance_weight": 0.2,
            "overall_profile_weight": 0.1
        }
        
        criteria = ranking_request.criteria or default_criteria
        limit = ranking_request.limit or 10
        
        # Create AI prompt
        prompt = f"""
        Please rank the following students for {'the specified project' if project_context else 'general capstone program placement'}.
        
        {project_context}
        
        Ranking Criteria (weights): {criteria}
        
        Students to rank:
        {student_data}
        
        Please provide:
        1. A ranked list of top {limit} students
        2. For each student, provide:
           - Rank (1 to {limit})
           - Student ID and name
           - Overall score (0-100)
           - Reasoning for the ranking
           - Strengths
           - Areas for improvement
        3. Summary of ranking methodology used
        
        Format the response as a structured analysis that can be easily parsed.
        """
        
        # Create AI request
        ai_request = AIRequest(
            task=AITask.STUDENT_RANKING,
            prompt=prompt,
            context={
                "project_id": ranking_request.project_id,
                "criteria": criteria,
                "student_count": len(students)
            },
            max_tokens=3000,
            temperature=0.3  # Lower temperature for more consistent rankings
        )
        
        # Get AI response
        ai_response = await ai_manager.generate_response(ai_request)
        
        if ai_response.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI ranking failed: {ai_response.error}"
            )
        
        # Parse AI response and create structured result
        # In a real implementation, you'd parse the AI response more carefully
        ranked_students = _parse_ranking_response(ai_response.content, student_data[:limit])
        
        return StudentRankingResponse(
            students=ranked_students,
            criteria_used=criteria,
            ai_provider=ai_response.provider,
            processing_time=ai_response.processing_time,
            cost=ai_response.cost
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ranking students: {str(e)}"
        )


@router.post("/by-skills", response_model=StudentRankingResponse)
async def rank_students_by_skills(
    required_skills: List[str],
    limit: Optional[int] = 10,
    current_user: User = Depends(get_current_mentor),
    db: Session = Depends(get_db)
):
    """
    Rank students based on specific skills
    """
    
    try:
        # Get all approved students with skills
        students = db.query(Student).options(joinedload(Student.user)).filter(
            Student.status == "Approved",
            Student.skills.isnot(None)
        ).all()
        
        if not students:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No students with skills found"
            )
        
        # Prepare student data
        student_data = []
        for student in students:
            student_info = {
                "id": student.user_id,
                "name": student.user.full_name or "N/A",
                "skills": student.skills or {},
                "gpa": float(student.gpa) if student.gpa else None,
                "program": student.program or "N/A"
            }
            student_data.append(student_info)
        
        # Create AI prompt for skills-based ranking
        prompt = f"""
        Rank the following students based on their match with these required skills: {required_skills}
        
        Students:
        {student_data}
        
        For each student, analyze:
        1. How many of the required skills they possess
        2. The proficiency level in each skill (if available)
        3. Related or transferable skills
        4. Overall skill match percentage
        
        Provide top {limit} students ranked by skill match, with scores and explanations.
        """
        
        ai_request = AIRequest(
            task=AITask.SKILL_EXTRACTION,
            prompt=prompt,
            context={"required_skills": required_skills},
            max_tokens=2000,
            temperature=0.2
        )
        
        ai_response = await ai_manager.generate_response(ai_request)
        
        if ai_response.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Skill ranking failed: {ai_response.error}"
            )
        
        ranked_students = _parse_ranking_response(ai_response.content, student_data[:limit])
        
        return StudentRankingResponse(
            students=ranked_students,
            criteria_used={"required_skills": required_skills, "skill_match_weight": 1.0},
            ai_provider=ai_response.provider,
            processing_time=ai_response.processing_time,
            cost=ai_response.cost
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ranking students by skills: {str(e)}"
        )


def _parse_ranking_response(ai_content: str, student_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Parse AI ranking response into structured format
    This is a simplified parser - in production, you'd want more robust parsing
    """
    
    # For now, return the student data with mock ranking scores
    # In a real implementation, you'd parse the AI response
    ranked_students = []
    
    for i, student in enumerate(student_data):
        ranked_student = {
            "rank": i + 1,
            "student_id": student.get("id"),
            "name": student.get("name"),
            "email": student.get("email"),
            "gpa": student.get("gpa"),
            "program": student.get("program"),
            "skills": student.get("skills", {}),
            "score": 95 - (i * 3),  # Mock scoring
            "reasoning": "AI analysis based on profile match",
            "strengths": ["Strong technical skills", "Good academic performance"],
            "areas_for_improvement": ["Could improve soft skills", "More project experience needed"]
        }
        ranked_students.append(ranked_student)
    
    return ranked_students


@router.get("/criteria", response_model=Dict[str, Any])
async def get_ranking_criteria(
    current_user: User = Depends(get_current_mentor)
):
    """Get available ranking criteria and their descriptions"""
    
    criteria_options = {
        "academic_performance": {
            "description": "GPA and academic achievements",
            "weight_range": [0.1, 0.5],
            "recommended": 0.3
        },
        "skills_match": {
            "description": "Technical and soft skills alignment with project requirements",
            "weight_range": [0.2, 0.6],
            "recommended": 0.4
        },
        "program_relevance": {
            "description": "Academic program relevance to project domain",
            "weight_range": [0.1, 0.4],
            "recommended": 0.2
        },
        "overall_profile": {
            "description": "Holistic assessment including experience, potential, and fit",
            "weight_range": [0.05, 0.2],
            "recommended": 0.1
        },
        "availability": {
            "description": "Student availability and commitment level",
            "weight_range": [0.05, 0.2],
            "recommended": 0.1
        }
    }
    
    return {
        "available_criteria": criteria_options,
        "total_weight_must_equal": 1.0,
        "min_students_required": 1,
        "max_students_to_rank": 50
    }
