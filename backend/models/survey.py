"""
Survey models for SMART Connect
Survey definitions and responses
"""
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ..core.database import Base


class Survey(Base):
    __tablename__ = "surveys"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(100))
    status = Column(String(20), default="Active")  # Active, Closed
    due_date = Column(Date)

    # Relationships
    responses = relationship("SurveyResponse", back_populates="survey")

    def __repr__(self):
        return f"<Survey(id={self.id}, title='{self.title}', status='{self.status}')>"


class SurveyResponse(Base):
    __tablename__ = "survey_responses"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("capstone.surveys.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("capstone.users.id", ondelete="CASCADE"))
    response_data = Column(JSONB)

    # Relationships
    survey = relationship("Survey", back_populates="responses")
    user = relationship("User", back_populates="survey_responses")

    def __repr__(self):
        return f"<SurveyResponse(id={self.id}, survey_id={self.survey_id}, user_id={self.user_id})>"