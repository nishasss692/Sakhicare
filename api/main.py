from fastapi import FastAPI
from api.schemas import PatientData
import joblib
import pandas as pd
import os

# 1. Initialize the app
app = FastAPI(title="PCOS Risk Predictor API")

# 2. Load the trained model on startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'pcos_classifier_model.joblib')
model = joblib.load(MODEL_PATH)

# 3. Create the prediction endpoint
@app.post("/predict")
def predict_risk(data: PatientData):
    # Convert the incoming JSON payload into a DataFrame with the exact column names 
    # our model expects based on the Kaggle dataset
    input_df = pd.DataFrame([{
        'Age (yrs)': data.age,
        'Weight (Kg)': data.weight,
        'Height(Cm)': data.height,
        'BMI': data.bmi,
        'Cycle(R/I)': data.cycle_ri,
        'Cycle length(days)': data.cycle_length,
        'Weight gain(Y/N)': data.weight_gain,
        'hair growth(Y/N)': data.hair_growth,
        'Skin darkening (Y/N)': data.skin_darkening,
        'Hair loss(Y/N)': data.hair_loss,
        'Pimples(Y/N)': data.pimples,
        'Fast food (Y/N)': data.fast_food,
        'Reg.Exercise(Y/N)': data.reg_exercise
    }])
    
    # Get prediction (0 or 1) and probability
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1] 
    
    return {
        "risk_prediction": int(prediction),
        "probability_percentage": round(float(probability) * 100, 2),
        "message": "High Risk of PCOS" if prediction == 1 else "Low Risk of PCOS"
    }