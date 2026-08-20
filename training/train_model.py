import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# 1. Setup absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'PCOS_data_without_infertility.xlsx')
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'pcos_classifier_model.joblib')

print("Loading data...")
# 2. Load the dataset
df = pd.read_excel(DATA_PATH, sheet_name='Full_new')

# FIX: Strip any hidden spaces from the start and end of all column names in the Excel file
df.columns = df.columns.str.strip()

# 3. Select non-invasive features (Notice I removed the trailing space in 'Height(Cm)')
selected_features = [
    'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 
    'Cycle(R/I)', 'Cycle length(days)', 
    'Weight gain(Y/N)', 'hair growth(Y/N)', 
    'Skin darkening (Y/N)', 'Hair loss(Y/N)', 'Pimples(Y/N)', 
    'Fast food (Y/N)', 'Reg.Exercise(Y/N)'
]
target = 'PCOS (Y/N)'

# Clean data: Convert to numeric, fill missing values
for col in selected_features + [target]:
    df[col] = pd.to_numeric(df[col], errors='coerce')

X = df[selected_features].copy()
y = df[target].copy()

X = X.fillna(X.median())
y = y.fillna(y.mode()[0])

# 4. Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. Train the Random Forest
print("Training model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate
print("\n--- Model Evaluation ---")
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))

# 7. Save the model artifact
print("Saving model...")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True) # <--- THIS IS THE NEW LINE
joblib.dump(model, MODEL_PATH)
print(f"\nSuccess! Model saved to:\n{MODEL_PATH}")