from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# User Authentication Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# PCOS ML Assessment Input/Output Schemas[cite: 1]
class PCOSAssessmentInput(BaseModel):
    bmi: float = Field(..., example=24.5, description="Body Mass Index")
    cycle_regularity: int = Field(..., example=1, description="0 for Regular, 1 for Irregular")
    testosterone_level: float = Field(..., example=0.6, description="Free Testosterone Level in ng/mL")

class PCOSAssessmentOutput(BaseModel):
    risk_score: float
    pcos_detected: bool
    recommendation: str