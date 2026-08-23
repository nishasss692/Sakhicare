from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessments = relationship("RiskAssessment", back_populates="user", cascade="all, delete-orphan")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 13 Clinical & lifestyle inputs
    age = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    cycle_ri = Column(Integer, nullable=False)  # 2: Regular, 4: Irregular
    cycle_length = Column(Float, nullable=False)
    weight_gain = Column(Integer, nullable=False)  # 1: Yes, 0: No
    hair_growth = Column(Integer, nullable=False)
    skin_darkening = Column(Integer, nullable=False)
    hair_loss = Column(Integer, nullable=False)
    pimples = Column(Integer, nullable=False)
    fast_food = Column(Integer, nullable=False)
    reg_exercise = Column(Integer, nullable=False)
    
    # Model Output
    risk_score = Column(Float, nullable=False)
    prediction = Column(String, nullable=False)
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="assessments")