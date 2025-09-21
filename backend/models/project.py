"""
Project model for SMART Connect
Project information and student/mentor assignments
"""
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from core.database import Base


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    company_id = Column(Integer, ForeignKey("capstone.companies.id", ondelete="SET NULL"))
    status = Column(String(20), default="Not Assigned")  # Not Assigned, Ongoing, Completed
    start_date = Column(Date)
    completion_date = Column(Date)

    # Relationships
    company = relationship("Company", back_populates="projects")
    project_students = relationship("ProjectStudent", back_populates="project")
    project_mentors = relationship("ProjectMentor", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}', status='{self.status}')>"


class ProjectStudent(Base):
    __tablename__ = "project_students"
    __table_args__ = {"schema": "capstone"}

    project_id = Column(Integer, ForeignKey("capstone.projects.id", ondelete="CASCADE"), primary_key=True)
    student_user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    project = relationship("Project", back_populates="project_students")
    student = relationship("User", foreign_keys=[student_user_id])


class ProjectMentor(Base):
    __tablename__ = "project_mentors"
    __table_args__ = {"schema": "capstone"}

    project_id = Column(Integer, ForeignKey("capstone.projects.id", ondelete="CASCADE"), primary_key=True)
    mentor_user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    project = relationship("Project", back_populates="project_mentors")
    mentor = relationship("User", foreign_keys=[mentor_user_id])