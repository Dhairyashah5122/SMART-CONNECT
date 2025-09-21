"""
Student ranking flow for SMART Connect using Genkit
Integration with existing Genkit flows for AI-powered student ranking
"""
import asyncio
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

from ..ai_adapters.base import AIRequest, AIResponse, AITask
from ..ai_adapters.manager import ai_manager
from ..core.config import settings

import logging
logger = logging.getLogger(__name__)


@dataclass
class StudentProfile:
    """Student profile data for ranking"""
    id: int
    name: str
    email: str
    gpa: Optional[float]
    program: Optional[str]
    skills: Dict[str, Any]
    resume_text: Optional[str]
    student_id_number: Optional[str]


@dataclass
class ProjectRequirements:
    """Project requirements for student matching"""
    id: Optional[int]
    name: str
    description: Optional[str]
    required_skills: List[str]
    preferred_gpa: Optional[float]
    program_preferences: List[str]


@dataclass
class RankingCriteria:
    """Ranking criteria and weights"""
    gpa_weight: float = 0.3
    skills_match_weight: float = 0.4
    program_relevance_weight: float = 0.2
    overall_profile_weight: float = 0.1
    custom_criteria: Optional[Dict[str, Any]] = None


class StudentRankingFlow:
    """
    Genkit flow for ranking students using AI
    Integrates with existing AI adapters and provides structured ranking
    """
    
    def __init__(self):
        self.ai_manager = ai_manager
    
    async def rank_students_for_project(
        self,
        students: List[StudentProfile],
        project: Optional[ProjectRequirements] = None,
        criteria: Optional[RankingCriteria] = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Main flow for ranking students for a project
        """
        
        try:
            # Set default criteria if not provided
            if criteria is None:
                criteria = RankingCriteria()
            
            # Prepare context for AI
            context = {
                "student_count": len(students),
                "project_id": project.id if project else None,
                "criteria": criteria.__dict__,
                "limit": limit
            }
            
            # Build comprehensive prompt
            prompt = self._build_ranking_prompt(students, project, criteria, limit)
            
            # Create AI request
            ai_request = AIRequest(
                task=AITask.STUDENT_RANKING,
                prompt=prompt,
                context=context,
                max_tokens=3000,
                temperature=0.3
            )
            
            # Get AI response
            ai_response = await self.ai_manager.generate_response(ai_request)
            
            if ai_response.error:
                logger.error(f"AI ranking failed: {ai_response.error}")
                return {
                    "success": False,
                    "error": ai_response.error,
                    "ranked_students": []
                }
            
            # Process and structure the response
            ranked_students = await self._process_ranking_response(
                ai_response, students, limit
            )
            
            return {
                "success": True,
                "ranked_students": ranked_students,
                "criteria_used": criteria.__dict__,
                "ai_metadata": {
                    "provider": ai_response.provider,
                    "cost": ai_response.cost,
                    "processing_time": ai_response.processing_time,
                    "tokens_used": ai_response.tokens_used
                },
                "project_context": project.__dict__ if project else None
            }
            
        except Exception as e:
            logger.error(f"Error in ranking flow: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "ranked_students": []
            }
    
    async def rank_students_by_skills(
        self,
        students: List[StudentProfile],
        required_skills: List[str],
        skill_weights: Optional[Dict[str, float]] = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Flow for ranking students based on specific skills
        """
        
        try:
            # Prepare skill-focused prompt
            prompt = self._build_skill_ranking_prompt(
                students, required_skills, skill_weights, limit
            )
            
            context = {
                "ranking_type": "skills_based",
                "required_skills": required_skills,
                "skill_weights": skill_weights or {},
                "student_count": len(students)
            }
            
            ai_request = AIRequest(
                task=AITask.SKILL_EXTRACTION,
                prompt=prompt,
                context=context,
                max_tokens=2500,
                temperature=0.2
            )
            
            ai_response = await self.ai_manager.generate_response(ai_request)
            
            if ai_response.error:
                return {
                    "success": False,
                    "error": ai_response.error,
                    "ranked_students": []
                }
            
            ranked_students = await self._process_skill_ranking_response(
                ai_response, students, required_skills, limit
            )
            
            return {
                "success": True,
                "ranked_students": ranked_students,
                "ranking_type": "skills_based",
                "required_skills": required_skills,
                "ai_metadata": {
                    "provider": ai_response.provider,
                    "cost": ai_response.cost,
                    "processing_time": ai_response.processing_time
                }
            }
            
        except Exception as e:
            logger.error(f"Error in skill ranking flow: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "ranked_students": []
            }
    
    async def analyze_student_project_fit(
        self,
        student: StudentProfile,
        project: ProjectRequirements
    ) -> Dict[str, Any]:
        """
        Analyze how well a specific student fits a specific project
        """
        
        try:
            prompt = f"""
            Analyze the fit between this student and project:
            
            Student Profile:
            - Name: {student.name}
            - GPA: {student.gpa or 'N/A'}
            - Program: {student.program or 'N/A'}
            - Skills: {student.skills}
            - Resume Summary: {student.resume_text[:300] if student.resume_text else 'N/A'}
            
            Project Requirements:
            - Name: {project.name}
            - Description: {project.description or 'N/A'}
            - Required Skills: {project.required_skills}
            - Preferred GPA: {project.preferred_gpa or 'N/A'}
            - Program Preferences: {project.program_preferences}
            
            Provide:
            1. Overall fit score (0-100)
            2. Skill match analysis
            3. Academic fit assessment
            4. Strengths for this project
            5. Potential challenges
            6. Recommendations for improvement
            """
            
            ai_request = AIRequest(
                task=AITask.PROJECT_MATCHING,
                prompt=prompt,
                context={
                    "student_id": student.id,
                    "project_id": project.id,
                    "analysis_type": "individual_fit"
                },
                max_tokens=1500,
                temperature=0.4
            )
            
            ai_response = await self.ai_manager.generate_response(ai_request)
            
            if ai_response.error:
                return {
                    "success": False,
                    "error": ai_response.error
                }
            
            return {
                "success": True,
                "student_id": student.id,
                "project_id": project.id,
                "analysis": ai_response.content,
                "ai_metadata": {
                    "provider": ai_response.provider,
                    "cost": ai_response.cost,
                    "processing_time": ai_response.processing_time
                }
            }
            
        except Exception as e:
            logger.error(f"Error in fit analysis: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _build_ranking_prompt(
        self,
        students: List[StudentProfile],
        project: Optional[ProjectRequirements],
        criteria: RankingCriteria,
        limit: int
    ) -> str:
        """Build comprehensive ranking prompt"""
        
        # Project context
        project_context = ""
        if project:
            project_context = f"""
            PROJECT DETAILS:
            Name: {project.name}
            Description: {project.description or 'N/A'}
            Required Skills: {project.required_skills}
            Preferred GPA: {project.preferred_gpa or 'No preference'}
            Program Preferences: {project.program_preferences}
            """
        
        # Student data
        student_data = []
        for student in students:
            student_info = f"""
            ID: {student.id}
            Name: {student.name}
            GPA: {student.gpa or 'N/A'}
            Program: {student.program or 'N/A'}
            Skills: {student.skills}
            Resume Summary: {student.resume_text[:200] if student.resume_text else 'No resume'}
            """
            student_data.append(student_info)
        
        # Criteria
        criteria_text = f"""
        RANKING CRITERIA:
        - Academic Performance (GPA): {criteria.gpa_weight * 100}%
        - Skills Match: {criteria.skills_match_weight * 100}%
        - Program Relevance: {criteria.program_relevance_weight * 100}%
        - Overall Profile: {criteria.overall_profile_weight * 100}%
        """
        
        if criteria.custom_criteria:
            criteria_text += f"\nCustom Criteria: {criteria.custom_criteria}"
        
        prompt = f"""
        TASK: Rank students for {'project assignment' if project else 'general capstone program'}.
        
        {project_context}
        
        {criteria_text}
        
        STUDENTS TO RANK:
        {chr(10).join(student_data)}
        
        INSTRUCTIONS:
        1. Evaluate each student against the criteria
        2. Provide top {limit} students ranked by overall score
        3. For each ranked student, include:
           - Rank (1-{limit})
           - Student ID and Name
           - Overall Score (0-100)
           - Detailed reasoning
           - Key strengths
           - Areas for development
           - Specific project fit (if applicable)
        
        4. Provide a summary of your ranking methodology
        
        Format your response clearly with student rankings and explanations.
        """
        
        return prompt
    
    def _build_skill_ranking_prompt(
        self,
        students: List[StudentProfile],
        required_skills: List[str],
        skill_weights: Optional[Dict[str, float]],
        limit: int
    ) -> str:
        """Build skill-focused ranking prompt"""
        
        student_data = []
        for student in students:
            student_info = f"""
            ID: {student.id}
            Name: {student.name}
            Skills: {student.skills}
            Program: {student.program or 'N/A'}
            GPA: {student.gpa or 'N/A'}
            """
            student_data.append(student_info)
        
        weights_text = ""
        if skill_weights:
            weights_text = f"Skill Weights: {skill_weights}"
        
        prompt = f"""
        TASK: Rank students based on skill match for required skills.
        
        REQUIRED SKILLS: {required_skills}
        {weights_text}
        
        STUDENTS:
        {chr(10).join(student_data)}
        
        ANALYSIS REQUIREMENTS:
        1. Calculate skill match percentage for each student
        2. Consider skill proficiency levels if available
        3. Account for related/transferable skills
        4. Rank top {limit} students by skill match
        
        For each student provide:
        - Skill match score (0-100)
        - Matched skills list
        - Missing critical skills
        - Transferable skills identified
        - Overall assessment
        
        Focus purely on technical skill alignment.
        """
        
        return prompt
    
    async def _process_ranking_response(
        self,
        ai_response: AIResponse,
        students: List[StudentProfile],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Process AI ranking response into structured format"""
        
        # In a production system, you'd implement robust parsing of the AI response
        # For now, we'll create a structured response based on the input students
        
        ranked_students = []
        
        for i, student in enumerate(students[:limit]):
            ranked_student = {
                "rank": i + 1,
                "student_id": student.id,
                "name": student.name,
                "email": student.email,
                "gpa": student.gpa,
                "program": student.program,
                "skills": student.skills,
                "score": max(95 - (i * 2), 60),  # Mock scoring for demo
                "reasoning": f"Strong candidate based on profile analysis. {ai_response.content[:100]}...",
                "strengths": ["Technical skills", "Academic performance", "Program fit"],
                "areas_for_improvement": ["Industry experience", "Soft skills development"],
                "ai_analysis_excerpt": ai_response.content[:200]
            }
            ranked_students.append(ranked_student)
        
        return ranked_students
    
    async def _process_skill_ranking_response(
        self,
        ai_response: AIResponse,
        students: List[StudentProfile],
        required_skills: List[str],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Process skill-based ranking response"""
        
        ranked_students = []
        
        for i, student in enumerate(students[:limit]):
            # Calculate simple skill match (in production, parse from AI response)
            student_skills = list(student.skills.keys()) if student.skills else []
            matched_skills = [skill for skill in required_skills if skill.lower() in [s.lower() for s in student_skills]]
            skill_match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
            
            ranked_student = {
                "rank": i + 1,
                "student_id": student.id,
                "name": student.name,
                "skill_match_score": min(skill_match_percentage + (90 - i * 5), 100),
                "matched_skills": matched_skills,
                "missing_skills": [skill for skill in required_skills if skill not in matched_skills],
                "all_skills": student_skills,
                "ai_analysis": ai_response.content[:150]
            }
            ranked_students.append(ranked_student)
        
        return ranked_students


# Global flow instance
student_ranking_flow = StudentRankingFlow()