import React, { useState, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  ShieldCheck,
  ClipboardCheck, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Scissors,
  Flame,
  Moon,
  Utensils,
  Dumbbell,
  ShieldAlert
} from 'lucide-react';

export default function AssessmentWizard({ onSubmit, isLoading, onAuthRequired, isAuthenticated }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    cycle_ri: 2, // 2 for Regular, 4 for Irregular
    cycle_length: '28',
    weight_gain: 0,
    hair_growth: 0,
    skin_darkening: 0,
    hair_loss: 0,
    pimples: 0,
    fast_food: 0,
    reg_exercise: 1
  });

  const [errors, setErrors] = useState({});

  // Compute live BMI & category
  const calculatedBMI = useMemo(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 50 && w > 20) {
      const heightM = h / 100;
      const bmi = (w / (heightM * heightM)).toFixed(1);
      let status = 'Normal Weight';
      if (bmi < 18.5) status = 'Underweight';
      else if (bmi >= 25 && bmi < 30) status = 'Overweight';
      else if (bmi >= 30) status = 'Obese';
      return { value: bmi, status };
    }
    return null;
  }, [formData.height, formData.weight]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleSymptom = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1
    }));
  };

  // Step Validations
  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.age || formData.age < 10 || formData.age > 90) {
        errs.age = 'Please enter a valid age (10 - 90 yrs)';
      }
      if (!formData.height || formData.height < 100 || formData.height > 230) {
        errs.height = 'Please enter a valid height (100 - 230 cm)';
      }
      if (!formData.weight || formData.weight < 25 || formData.weight > 220) {
        errs.weight = 'Please enter a valid weight (25 - 220 kg)';
      }
    } else if (step === 2) {
      if (!formData.cycle_length || formData.cycle_length < 15 || formData.cycle_length > 180) {
        errs.cycle_length = 'Please enter average cycle length in days (15 - 180)';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    const payload = {
      age: parseFloat(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      bmi: calculatedBMI ? parseFloat(calculatedBMI.value) : undefined,
      cycle_ri: parseInt(formData.cycle_ri, 10),
      cycle_length: parseFloat(formData.cycle_length),
      weight_gain: formData.weight_gain,
      hair_growth: formData.hair_growth,
      skin_darkening: formData.skin_darkening,
      hair_loss: formData.hair_loss,
      pimples: formData.pimples,
      fast_food: formData.fast_food,
      reg_exercise: formData.reg_exercise
    };

    onSubmit(payload);
  };

  return (
    <div className="assessment-container">
      <div className="container">
        <div className="card-wizard">
          {/* Header & Step Tracker */}
          <div className="wizard-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>PCOS Health Risk Screening</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>
                  Answer 13 non-invasive clinical & lifestyle questions
                </p>
              </div>
              <span style={{ 
                background: 'var(--primary-light)', 
                color: 'var(--primary)', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)'
              }}>
                Step {step} of 4
              </span>
            </div>

            {/* Progress Bar */}
            <div className="wizard-progress-bar">
              <div 
                className="wizard-progress-fill" 
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Step Labels */}
            <div className="step-indicators">
              <span className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Biometrics</span>
              <span className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Menstrual Cycle</span>
              <span className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Symptoms</span>
              <span className={`step-indicator ${step >= 4 ? 'active' : ''}`}>4. Lifestyle</span>
            </div>
          </div>

          {/* Form Wizard Body */}
          <form onSubmit={handleSubmit}>
            <div className="wizard-body">
              {/* STEP 1: Biometrics */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Basic Biometrics</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Used to evaluate BMI and metabolic health baseline.
                    </p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Age (Years)
                        <span className="form-hint">e.g. 24</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Age in years"
                        value={formData.age}
                        onChange={e => handleInputChange('age', e.target.value)}
                        min="10"
                        max="100"
                        required
                      />
                      {errors.age && <span style={{ color: 'var(--risk-high)', fontSize: '0.8rem' }}>{errors.age}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Height (cm)
                        <span className="form-hint">e.g. 162</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Height in centimeters"
                        value={formData.height}
                        onChange={e => handleInputChange('height', e.target.value)}
                        min="50"
                        max="250"
                        required
                      />
                      {errors.height && <span style={{ color: 'var(--risk-high)', fontSize: '0.8rem' }}>{errors.height}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Weight (kg)
                        <span className="form-hint">e.g. 60</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Weight in kilograms"
                        value={formData.weight}
                        onChange={e => handleInputChange('weight', e.target.value)}
                        min="20"
                        max="250"
                        required
                      />
                      {errors.weight && <span style={{ color: 'var(--risk-high)', fontSize: '0.8rem' }}>{errors.weight}</span>}
                    </div>

                    {calculatedBMI && (
                      <div className="bmi-preview-badge">
                        <span>Calculated BMI: <strong>{calculatedBMI.value}</strong></span>
                        <span style={{ 
                          padding: '3px 10px', 
                          background: 'white', 
                          borderRadius: 'var(--radius-full)', 
                          fontSize: '0.8rem' 
                        }}>
                          {calculatedBMI.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Menstrual Cycle */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Menstrual Cycle Pattern</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Menstrual regularity is one of the primary Rotterdam clinical indicators for PCOS.
                    </p>
                  </div>

                  <div className="form-grid-1col">
                    <div className="form-group">
                      <label className="form-label">Cycle Regularity</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '6px' }}>
                        <div 
                          className={`symptom-card ${formData.cycle_ri === 2 ? 'selected' : ''}`}
                          onClick={() => handleInputChange('cycle_ri', 2)}
                        >
                          <div className="symptom-info">
                            <div className="symptom-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                              <CheckCircle2 size={22} />
                            </div>
                            <div>
                              <div className="symptom-title">Regular Cycle</div>
                              <div className="symptom-desc">Periods arrive predictably every 21–35 days</div>
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`symptom-card ${formData.cycle_ri === 4 ? 'selected' : ''}`}
                          onClick={() => handleInputChange('cycle_ri', 4)}
                        >
                          <div className="symptom-info">
                            <div className="symptom-icon" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                              <AlertCircle size={22} />
                            </div>
                            <div>
                              <div className="symptom-title">Irregular / Absent</div>
                              <div className="symptom-desc">Missed cycles, frequent delays, or unpredictable flow</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label className="form-label">
                        Average Cycle Length (in Days)
                        <span className="form-hint">Normal range is 21 to 35 days</span>
                      </label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 28"
                        value={formData.cycle_length}
                        onChange={e => handleInputChange('cycle_length', e.target.value)}
                        min="10"
                        max="180"
                        required
                      />
                      {errors.cycle_length && <span style={{ color: 'var(--risk-high)', fontSize: '0.8rem' }}>{errors.cycle_length}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Physical & Skin Symptoms */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Physical & Hormonal Symptoms</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Select any symptoms you have noticed recently.
                    </p>
                  </div>

                  <div className="form-grid-1col">
                    {/* Weight Gain */}
                    <div 
                      className={`symptom-card ${formData.weight_gain === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('weight_gain')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <Activity size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Rapid / Unexplained Weight Gain</div>
                          <div className="symptom-desc">Difficulty losing weight or sudden abdominal fat gain</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.weight_gain === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>

                    {/* Hirsutism / Hair Growth */}
                    <div 
                      className={`symptom-card ${formData.hair_growth === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('hair_growth')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <Scissors size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Excessive Facial/Body Hair (Hirsutism)</div>
                          <div className="symptom-desc">Dark, coarse hair on chin, upper lip, chest, or abdomen</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.hair_growth === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>

                    {/* Skin Darkening */}
                    <div 
                      className={`symptom-card ${formData.skin_darkening === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('skin_darkening')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <Moon size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Skin Darkening (Acanthosis Nigricans)</div>
                          <div className="symptom-desc">Dark, velvety patches on neck creases, armpits, or groin</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.skin_darkening === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>

                    {/* Hair Loss */}
                    <div 
                      className={`symptom-card ${formData.hair_loss === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('hair_loss')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Scalp Hair Thinning / Hair Loss</div>
                          <div className="symptom-desc">Noticeable widening of hair partition or male-pattern thinning</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.hair_loss === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>

                    {/* Pimples / Acne */}
                    <div 
                      className={`symptom-card ${formData.pimples === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('pimples')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <Flame size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Severe or Hormonal Acne / Pimples</div>
                          <div className="symptom-desc">Cystic acne around jawline and chin resistant to topicals</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.pimples === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Lifestyle & Diet */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Lifestyle & Diet Factors</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Diet and physical activity directly influence insulin sensitivity.
                    </p>
                  </div>

                  <div className="form-grid-1col">
                    {/* Fast Food Intake */}
                    <div 
                      className={`symptom-card ${formData.fast_food === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('fast_food')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon">
                          <Utensils size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Frequent Fast Food / Processed Meals</div>
                          <div className="symptom-desc">Consuming high-glycemic or fast food more than 2-3 times/week</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.fast_food === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>

                    {/* Regular Exercise */}
                    <div 
                      className={`symptom-card ${formData.reg_exercise === 1 ? 'selected' : ''}`}
                      onClick={() => toggleSymptom('reg_exercise')}
                    >
                      <div className="symptom-info">
                        <div className="symptom-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                          <Dumbbell size={20} />
                        </div>
                        <div>
                          <div className="symptom-title">Regular Physical Activity / Exercise</div>
                          <div className="symptom-desc">Engaging in 30+ mins of workout or brisk walking at least 3 days/week</div>
                        </div>
                      </div>
                      <div className={`switch ${formData.reg_exercise === 1 ? 'checked' : ''}`}>
                        <div className="switch-handle" />
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div style={{ 
                      padding: '14px 18px', 
                      background: 'var(--primary-subtle)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '8px'
                    }}>
                      <ShieldCheck size={20} color="var(--primary)" />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-heading)' }}>
                        <strong>Note:</strong> You will be prompted to quickly sign in or register to securely save your clinical assessment results.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="wizard-footer">
              {step > 1 ? (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handlePrev}
                  disabled={isLoading}
                >
                  <ArrowLeft size={18} />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext}
                >
                  <span>Next Step</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Analyzing Markers...</span>
                  ) : (
                    <>
                      <ClipboardCheck size={20} />
                      <span>Calculate Risk Score</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
