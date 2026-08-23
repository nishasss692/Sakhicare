# 🌸 SakhiCare — AI-Powered PCOS Risk Predictor & Health Companion

SakhiCare is a full-stack clinical screening and health platform for Polycystic Ovary Syndrome (PCOS) risk assessment. It uses a trained **Random Forest Machine Learning Classifier** on 13 non-invasive biometric, symptom, and lifestyle markers to provide early risk probability, detected factor breakdowns, and actionable clinical guidance.

---

## 🛠️ Tech Stack

* **Machine Learning**: Scikit-Learn (`RandomForestClassifier`, 86%+ accuracy), Pandas, Joblib.
* **Backend**: FastAPI, SQLAlchemy (SQLite/PostgreSQL), Pydantic v2, JWT Authentication (`python-jose`, `bcrypt`).
* **Frontend**: React 18, Vite, Vanilla CSS Design System, Lucide Icons, Canvas Confetti.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)

```powershell
# In the project root directory:
# Install dependencies
pip install -r requirements.txt

# (Optional) Train the model if needed
python training/train_model.py

# Start the FastAPI backend server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API documentation will be available at **`http://127.0.0.1:8000/docs`**.

---

### 2. Frontend Setup (React + Vite)

```powershell
# Navigate to the frontend directory:
cd frontend

# Install npm packages
npm install

# Start the Vite development server
npm run dev
```
Open **`http://localhost:5173`** in your browser to access the SakhiCare application.

---

## 📋 Features

1. **4-Step Clinical Wizard**:
   * **Step 1: Biometrics** (Age, Height, Weight with live BMI calculation).
   * **Step 2: Menstrual Cycle** (Regularity and cycle length in days).
   * **Step 3: Physical Symptoms** (Hirsutism, Acanthosis Nigricans, Acne, Hair thinning, Weight gain).
   * **Step 4: Lifestyle** (Fast food frequency, regular exercise).
2. **Interactive Visual Results**:
   * Animated radial risk gauge (0% to 100%).
   * Risk categorization: `Low Risk`, `Moderate Risk`, `High Risk`.
   * Symptom driver chips & tailored clinical next-step recommendations.
3. **Assessment History & Tracking**:
   * Persistent tracking of previous screenings for authenticated users.
4. **Knowledge Center**:
   * Rotterdam criteria guidelines, insulin resistance education, and lifestyle interventions.