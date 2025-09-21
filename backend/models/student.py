"""
Student model for SMART Connect
Student-specific information and relationships
"""
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.database import Base
from .user import User


class Student(Base):
    __tablename__ = "students"
    __table_args__ = {"schema": "capstone"}

    user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"), primary_key=True)
    student_id_number = Column(String(50), unique=True)
    gpa = Column(DECIMAL(3, 2))
    program = Column(String(100))
    resume_text = Column(Text)
    skills = Column(JSONB)
    status = Column(String(20), default="Pending")  # Pending, Approved, Rejected
    registration_date = Column(Date)

    # Relationships
    user = relationship("User", back_populates="student")

    def __repr__(self):
        return f"<Student(user_id={self.user_id}, student_id='{self.student_id_number}', status='{self.status}')>"