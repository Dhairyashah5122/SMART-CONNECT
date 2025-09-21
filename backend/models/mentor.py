"""
Mentor model for SMART Connect
Mentor-specific information and relationships
"""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.database import Base
from .user import User


class Mentor(Base):
    __tablename__ = "mentors"
    __table_args__ = {"schema": "capstone"}

    user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"), primary_key=True)
    skills = Column(JSONB)
    past_projects = Column(JSONB)
    status = Column(String(20), default="Available")  # Active, Available, Inactive

    # Relationships
    user = relationship("User", back_populates="mentor")

    def __repr__(self):
        return f"<Mentor(user_id={self.user_id}, status='{self.status}')>"