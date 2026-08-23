from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, RiskAssessment
from app.schemas import PCOSAssessmentInput, PCOSAssessmentOutput
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["PCOS Assessment"])

@router.post("/predict", response_model=PCOSAssessmentOutput)
def predict_pcos_risk(
    data: PCOSAssessmentInput, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Protected route: Calculates PCOS risk score based on non-invasive markers[cite: 1].
    Saves record to the database under the authenticated user.
    """
    # Baseline logic calculation rule (To be replaced by loaded ML model .pkl file)[cite: 1]
    calculated_score = (data.bmi * 0.02) + (data.cycle_regularity * 0.4) + (data.testosterone_level * 0.3)
    normalized_score = round(min(max(calculated_score, 0.05), 0.98), 2)
    is_pcos = normalized_score > 0.50

    # Save log to DB
    assessment_record = RiskAssessment(
        user_id=current_user.id,
        bmi=data.bmi,
        cycle_regularity=data.cycle_regularity,
        testosterone_level=data.testosterone_level,
        risk_score=normalized_score,
        prediction="High Risk" if is_pcos else "Low Risk"
    )
    db.add(assessment_record)
    db.commit()

    return PCOSAssessmentOutput(
        risk_score=normalized_score,
        pcos_detected=is_pcos,
        recommendation="Consult a specialist for further clinical testing[cite: 1]." if is_pcos else "Low clinical indicator present[cite: 1]."
    )