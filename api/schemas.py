from pydantic import BaseModel, Field

class PatientData(BaseModel):
    age: float = Field(..., description="Age in years")
    weight: float = Field(..., description="Weight in Kg")
    height: float = Field(..., description="Height in cm")
    bmi: float = Field(..., description="BMI")
    cycle_ri: int = Field(..., description="Cycle (R/I): 2 for regular, 4 for irregular")
    cycle_length: float = Field(..., description="Cycle length in days")
    weight_gain: int = Field(..., description="Weight gain (Y/N): 1 for Yes, 0 for No")
    hair_growth: int = Field(..., description="Hair growth (Y/N): 1 for Yes, 0 for No")
    skin_darkening: int = Field(..., description="Skin darkening (Y/N): 1 for Yes, 0 for No")
    hair_loss: int = Field(..., description="Hair loss (Y/N): 1 for Yes, 0 for No")
    pimples: int = Field(..., description="Pimples (Y/N): 1 for Yes, 0 for No")
    fast_food: int = Field(..., description="Fast food (Y/N): 1 for Yes, 0 for No")
    reg_exercise: int = Field(..., description="Regular Exercise (Y/N): 1 for Yes, 0 for No")