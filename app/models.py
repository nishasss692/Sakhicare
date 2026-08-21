from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bmi = Column(Float, nullable=False)
    cycle_regularity = Column(Integer, nullable=False) # 0: Regular, 1: Irregular
    testosterone_level = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    prediction = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())