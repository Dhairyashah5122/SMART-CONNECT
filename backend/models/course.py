"""
Course model for SMART Connect
Course information and student enrollments
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from core.database import Base


class Course(Base):
    __tablename__ = "courses"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    code = Column(String(50), unique=True)
    schedule = Column(Text)
    delivery_method = Column(String(50))
    mentor_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="SET NULL"))

    # Relationships
    mentor = relationship("User", foreign_keys=[mentor_id])
    course_students = relationship("CourseStudent", back_populates="course")

    def __repr__(self):
        return f"<Course(id={self.id}, title='{self.title}', code='{self.code}')>"


class CourseStudent(Base):
    __tablename__ = "course_students"
    __table_args__ = {"schema": "capstone"}

    course_id = Column(Integer, ForeignKey("capstone.courses.id", ondelete="CASCADE"), primary_key=True)
    student_user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    course = relationship("Course", back_populates="course_students")
    student = relationship("User", foreign_keys=[student_user_id])