"""
Company model for SMART Connect
Company information for project assignments
"""
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from core.database import Base


class Company(Base):
    __tablename__ = "companies"
    __table_args__ = {"schema": "capstone"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(100))
    website_url = Column(Text)
    contact_person_name = Column(String(255))
    contact_person_email = Column(String(255))

    # Relationships
    projects = relationship("Project", back_populates="company")

    def __repr__(self):
        return f"<Company(id={self.id}, name='{self.name}', industry='{self.industry}')>"