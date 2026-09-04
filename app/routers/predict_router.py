import os
import joblib
import pandas as pd
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, RiskAssessment
from app.schemas import PCOSAssessmentInput, PCOSAssessmentOutput, RiskAssessmentHistoryItem
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["PCOS Assessment"])

# Resolve model path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'pcos_classifier_model.joblib')
FALLBACK_MODEL_PATH = os.path.join(BASE_DIR, 'model', 'pcos_classifier_model.joblib')

# Load the trained ML model
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
elif os.path.exists(FALLBACK_MODEL_PATH):
    model = joblib.load(FALLBACK_MODEL_PATH)

def get_model():
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        elif os.path.exists(FALLBACK_MODEL_PATH):
            model = joblib.load(FALLBACK_MODEL_PATH)
        else:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Trained ML model artifact not found on server."
            )
    return model

@router.post("/predict", response_model=PCOSAssessmentOutput)
def predict_pcos_risk(
    data: PCOSAssessmentInput, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Protected route: Assesses PCOS risk using the trained Random Forest model
    trained on non-invasive clinical & lifestyle markers.
    Saves assessment record to the database under the authenticated user.
    """
    trained_model = get_model()

    # Auto-calculate BMI if not explicitly provided
    bmi_value = data.bmi
    if bmi_value is None or bmi_value <= 0:
        height_m = data.height / 100.0
        bmi_value = round(data.weight / (height_m ** 2), 2)

    # Normalize cycle regularity to match model encoding (2: Regular, 4: Irregular)
    cycle_encoded = 4 if data.cycle_ri in (1, 4) else 2

    # Prepare DataFrame matching exact feature column names used in training
    input_df = pd.DataFrame([{
        'Age (yrs)': float(data.age),
        'Weight (Kg)': float(data.weight),
        'Height(Cm)': float(data.height),
        'BMI': float(bmi_value),
        'Cycle(R/I)': int(cycle_encoded),
        'Cycle length(days)': float(data.cycle_length),
        'Weight gain(Y/N)': int(data.weight_gain),
        'hair growth(Y/N)': int(data.hair_growth),
        'Skin darkening (Y/N)': int(data.skin_darkening),
        'Hair loss(Y/N)': int(data.hair_loss),
        'Pimples(Y/N)': int(data.pimples),
        'Fast food (Y/N)': int(data.fast_food),
        'Reg.Exercise(Y/N)': int(data.reg_exercise)
    }])

    # Model inference
    raw_pred = int(trained_model.predict(input_df)[0])
    prob_pcos = float(trained_model.predict_proba(input_df)[0][1])
    risk_percentage = round(prob_pcos * 100.0, 2)
    is_pcos = bool(raw_pred == 1 or risk_percentage >= 50.0)

    # Determine risk category
    if risk_percentage >= 60.0:
        risk_level = "High Risk"
    elif risk_percentage >= 35.0:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Low Risk"

    # Identify contributing symptom factors for clinical explanation
    contributing_factors = []
    if cycle_encoded == 4 or data.cycle_length > 35 or data.cycle_length < 21:
        contributing_factors.append("Irregular or prolonged menstrual cycle")
    if bmi_value >= 25.0:
        contributing_factors.append(f"Elevated BMI ({bmi_value})")
    if data.weight_gain == 1:
        contributing_factors.append("Rapid or unexplained weight gain")
    if data.hair_growth == 1:
        contributing_factors.append("Hirsutism (excess facial/body hair)")
    if data.skin_darkening == 1:
        contributing_factors.append("Acanthosis Nigricans (skin darkening)")
    if data.pimples == 1:
        contributing_factors.append("Persistent acne or pimples")
    if data.hair_loss == 1:
        contributing_factors.append("Hair thinning or scalp hair loss")
    if data.fast_food == 1:
        contributing_factors.append("Frequent processed/fast food intake")
    if data.reg_exercise == 0:
        contributing_factors.append("Lack of regular physical exercise")

    # Generate personalized recommendations
    if is_pcos or risk_level == "High Risk":
        recommendation = (
            "We strongly advise consulting a gynecologist or endocrinologist for clinical confirmation. "
            "A pelvic ultrasound (USG) and hormone panel (LH, FSH, AMH, Free Testosterone, Fasting Insulin) "
            "are recommended to evaluate ovarian morphology and metabolic markers."
        )
    elif risk_level == "Moderate Risk":
        recommendation = (
            "Moderate indicators detected. We recommend monitoring your menstrual cycles closely, "
            "adopting an anti-inflammatory low-glycemic diet, and scheduling a routine checkup with your healthcare provider."
        )
    else:
        recommendation = (
            "Low risk detected based on provided indicators. Maintain a balanced nutrient-dense diet, "
            "regular exercise, and healthy sleep routine to support hormonal health."
        )

    # Persist assessment into database
    assessment_record = RiskAssessment(
        user_id=current_user.id,
        age=data.age,
        weight=data.weight,
        height=data.height,
        bmi=bmi_value,
        cycle_ri=cycle_encoded,
        cycle_length=data.cycle_length,
        weight_gain=data.weight_gain,
        hair_growth=data.hair_growth,
        skin_darkening=data.skin_darkening,
        hair_loss=data.hair_loss,
        pimples=data.pimples,
        fast_food=data.fast_food,
        reg_exercise=data.reg_exercise,
        risk_score=risk_percentage,
        prediction=risk_level,
        recommendation=recommendation
    )
    db.add(assessment_record)
    db.commit()
    db.refresh(assessment_record)

    return PCOSAssessmentOutput(
        assessment_id=assessment_record.id,
        risk_score=risk_percentage,
        risk_level=risk_level,
        pcos_detected=is_pcos,
        recommendation=recommendation,
        contributing_factors=contributing_factors
    )

@router.get("/assessments", response_model=List[RiskAssessmentHistoryItem])
def get_user_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve historical PCOS assessments for the currently logged-in user.
    """
    history = db.query(RiskAssessment).filter(
        RiskAssessment.user_id == current_user.id
    ).order_by(RiskAssessment.created_at.desc()).all()
    return history

@router.get("/assessments/{assessment_id}", response_model=RiskAssessmentHistoryItem)
def get_assessment_by_id(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific assessment by its ID for the current user.
    """
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.id == assessment_id,
        RiskAssessment.user_id == current_user.id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment record not found")
    return assessment

@router.delete("/assessments/{assessment_id}")
def delete_assessment_by_id(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific assessment record owned by the authenticated user.
    """
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.id == assessment_id,
        RiskAssessment.user_id == current_user.id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment record not found")
    db.delete(assessment)
    db.commit()
    return {"message": "Assessment record successfully deleted", "id": assessment_id}