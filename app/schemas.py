from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

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

# PCOS ML Assessment Input/Output Schemas
class PCOSAssessmentInput(BaseModel):
    age: float = Field(..., ge=10, le=100, example=26.0, description="Age in years")
    weight: float = Field(..., ge=20, le=250, example=65.0, description="Weight in Kg")
    height: float = Field(..., ge=50, le=250, example=160.0, description="Height in cm")
    bmi: Optional[float] = Field(None, description="BMI (auto-calculated from height & weight if omitted)")
    cycle_ri: int = Field(..., example=4, description="Menstrual Cycle regularity: 2 for Regular, 4 for Irregular (or 0/1)")
    cycle_length: float = Field(..., ge=1, le=180, example=35.0, description="Average cycle length in days")
    weight_gain: int = Field(..., ge=0, le=1, example=1, description="Sudden/Rapid weight gain (1: Yes, 0: No)")
    hair_growth: int = Field(..., ge=0, le=1, example=1, description="Excessive facial/body hair growth / Hirsutism (1: Yes, 0: No)")
    skin_darkening: int = Field(..., ge=0, le=1, example=1, description="Skin darkening / Acanthosis Nigricans (1: Yes, 0: No)")
    hair_loss: int = Field(..., ge=0, le=1, example=0, description="Hair loss / Thinning (1: Yes, 0: No)")
    pimples: int = Field(..., ge=0, le=1, example=1, description="Pimples / Severe acne (1: Yes, 0: No)")
    fast_food: int = Field(..., ge=0, le=1, example=1, description="Frequent fast food / processed food consumption (1: Yes, 0: No)")
    reg_exercise: int = Field(..., ge=0, le=1, example=0, description="Regular exercise / physical activity (1: Yes, 0: No)")

class PCOSAssessmentOutput(BaseModel):
    assessment_id: Optional[int] = None
    risk_score: float = Field(..., description="PCOS Risk probability percentage (0.0 to 100.0%)")
    risk_level: str = Field(..., description="'Low Risk', 'Moderate Risk', or 'High Risk'")
    pcos_detected: bool = Field(..., description="True if model predicts high probability of PCOS")
    recommendation: str = Field(..., description="Actionable clinical & lifestyle advice")
    contributing_factors: List[str] = Field(default_factory=list, description="List of detected high-risk factors")

class RiskAssessmentHistoryItem(BaseModel):
    id: int
    age: float
    weight: float
    height: float
    bmi: float
    cycle_ri: int
    cycle_length: float
    risk_score: float
    prediction: str
    recommendation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True