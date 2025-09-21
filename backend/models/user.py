"""
User model for SMART Connect
Base user table with authentication and profile information
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.sql import expression

from core.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False)  # Admin, Mentor, Student
    full_name = Column(String(255))
    profile_photo_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("Student", back_populates="user", uselist=False)
    mentor = relationship("Mentor", back_populates="user", uselist=False)
    survey_responses = relationship("SurveyResponse", back_populates="user")
    
    # Many-to-many relationships
    student_projects = relationship("ProjectStudent", foreign_keys="ProjectStudent.student_user_id")
    mentor_projects = relationship("ProjectMentor", foreign_keys="ProjectMentor.mentor_user_id")
    student_courses = relationship("CourseStudent", foreign_keys="CourseStudent.student_user_id")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"