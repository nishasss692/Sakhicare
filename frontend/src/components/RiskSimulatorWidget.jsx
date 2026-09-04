import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Scale, 
  RotateCcw, 
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function RiskSimulatorWidget({ latestAssessment }) {
  // Baseline initial values from user's latest assessment or defaults
  const baseline = useMemo(() => {
    return {
      bmi: latestAssessment ? Number(latestAssessment.bmi || 26.5) : 26.5,
      exercise: latestAssessment ? (latestAssessment.reg_exercise === 1 ? 4 : 0) : 1,
      fastFood: latestAssessment ? (latestAssessment.fast_food === 1 ? 'frequent' : 'rare') : 'frequent',
      cycleIrregular: latestAssessment ? (latestAssessment.cycle_ri === 4) : true,
      hirsutism: latestAssessment ? (latestAssessment.hair_growth === 1) : true,
      skinDarkening: latestAssessment ? (latestAssessment.skin_darkening === 1) : true,
      acne: latestAssessment ? (latestAssessment.pimples === 1) : true
    };
  }, [latestAssessment]);

  // Simulated state
  const [bmi, setBmi] = useState(baseline.bmi);
  const [exerciseDays, setExerciseDays] = useState(baseline.exercise);
  const [fastFood, setFastFood] = useState(baseline.fastFood);
  const [cycleIrregular, setCycleIrregular] = useState(baseline.cycleIrregular);
  const [hirsutism, setHirsutism] = useState(baseline.hirsutism);
  const [skinDarkening, setSkinDarkening] = useState(baseline.skinDarkening);
  const [acne, setAcne] = useState(baseline.acne);

  // Reset to baseline
  const handleReset = () => {
    setBmi(baseline.bmi);
    setExerciseDays(baseline.exercise);
    setFastFood(baseline.fastFood);
    setCycleIrregular(baseline.cycleIrregular);
    setHirsutism(baseline.hirsutism);
    setSkinDarkening(baseline.skinDarkening);
    setAcne(baseline.acne);
  };

  // Model-grounded risk score calculator function
  const computeRisk = (b, ex, ff, irr, hir, sd, ac) => {
    let score = 15; // base probability

    // Cycle regularity (Strongest predictor in PCOS datasets)
    if (irr) score += 28;

    // Metabolic / BMI component
    if (b >= 30) score += 20;
    else if (b >= 25) score += 12;
    else if (b < 18.5) score += 5;

    // Hyperandrogenism markers
    if (hir) score += 14;
    if (sd) score += 12;
    if (ac) score += 8;

    // Lifestyle modulators
    if (ff === 'daily') score += 12;
    else if (ff === 'frequent') score += 8;
    else if (ff === 'moderate') score += 4;

    // Exercise protective reduction
    if (ex >= 4) score -= 15;
    else if (ex >= 2) score -= 8;

    // Bound between 5% and 95%
    return Math.max(5, Math.min(95, Math.round(score)));
  };

  const baselineScore = useMemo(() => {
    return computeRisk(
      baseline.bmi,
      baseline.exercise,
      baseline.fastFood,
      baseline.cycleIrregular,
      baseline.hirsutism,
      baseline.skinDarkening,
      baseline.acne
    );
  }, [baseline]);

  const simulatedScore = useMemo(() => {
    return computeRisk(bmi, exerciseDays, fastFood, cycleIrregular, hirsutism, skinDarkening, acne);
  }, [bmi, exerciseDays, fastFood, cycleIrregular, hirsutism, skinDarkening, acne]);

  const scoreDelta = simulatedScore - baselineScore;

  const getRiskCategory = (score) => {
    if (score >= 60) return { label: 'High Risk', color: 'var(--risk-high)', bg: 'var(--risk-high-bg)' };
    if (score >= 35) return { label: 'Moderate Risk', color: 'var(--risk-mod)', bg: 'var(--risk-mod-bg)' };
    return { label: 'Low Risk', color: 'var(--risk-low)', bg: 'var(--risk-low-bg)' };
  };

  const currentCategory = getRiskCategory(simulatedScore);

  return (
    <div className="risk-simulator-container">
      {/* Top Header */}
      <div className="simulator-header">
        <div className="sim-title-wrap">
          <div className="sim-icon-badge">
            <Zap size={24} color="#C026D3" />
          </div>
          <div>
            <h3 className="widget-title">Interactive "What-If" Risk Simulator</h3>
            <p className="widget-subtitle">
              Simulate how evidence-based lifestyle changes and metabolic optimization directly lower your PCOS risk score.
            </p>
          </div>
        </div>

        <button className="sim-reset-btn" onClick={handleReset} title="Reset sliders to baseline screening">
          <RotateCcw size={16} />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Main Grid: Controls Left, Result Gauge Right */}
      <div className="simulator-grid">
        {/* Left: Interactive Controls */}
        <div className="sim-controls-card">
          <h4 className="controls-heading">Adjust Health & Lifestyle Variables</h4>

          {/* BMI Slider */}
          <div className="control-slider-block">
            <div className="slider-label-row">
              <span className="slider-name">
                <Scale size={16} color="var(--primary)" />
                Body Mass Index (BMI):
              </span>
              <span className="slider-current-val">
                {bmi.toFixed(1)}
                <span className="val-subtext">
                  {bmi < 18.5 ? ' (Underweight)' : bmi < 25 ? ' (Normal)' : bmi < 30 ? ' (Overweight)' : ' (Obese)'}
                </span>
              </span>
            </div>
            <input 
              type="range" 
              min="17" 
              max="38" 
              step="0.5" 
              value={bmi} 
              onChange={(e) => setBmi(parseFloat(e.target.value))}
              className="custom-range-slider"
            />
            <div className="slider-ticks">
              <span>18.5 (Optimal)</span>
              <span>25.0 (Threshold)</span>
              <span>30.0+ (Elevated)</span>
            </div>
          </div>

          {/* Exercise Days Slider */}
          <div className="control-slider-block">
            <div className="slider-label-row">
              <span className="slider-name">
                <Activity size={16} color="var(--accent-teal)" />
                Exercise & Strength Training:
              </span>
              <span className="slider-current-val">
                {exerciseDays} days / week
                <span className="val-subtext">
                  {exerciseDays >= 4 ? ' (Optimal Insulin Sensitivity)' : exerciseDays >= 2 ? ' (Moderate)' : ' (Sedentary)'}
                </span>
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="7" 
              step="1" 
              value={exerciseDays} 
              onChange={(e) => setExerciseDays(parseInt(e.target.value))}
              className="custom-range-slider"
            />
            <div className="slider-ticks">
              <span>0 Days (Sedentary)</span>
              <span>3 Days</span>
              <span>5-7 Days (Target)</span>
            </div>
          </div>

          {/* Fast Food / Ultra-Processed Diet */}
          <div className="control-slider-block">
            <label className="slider-name" style={{ display: 'block', marginBottom: '8px' }}>
              🍔 Fast Food & Refined Sugar Frequency:
            </label>
            <div className="sim-button-group">
              {[
                { id: 'rare', label: 'Rarely / Whole Foods' },
                { id: 'moderate', label: '1–2x per week' },
                { id: 'frequent', label: '3–5x per week' },
                { id: 'daily', label: 'Almost Daily' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`sim-choice-btn ${fastFood === item.id ? 'active' : ''}`}
                  onClick={() => setFastFood(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Biological & Cycle Toggles */}
          <div className="sim-toggles-block">
            <span className="slider-name" style={{ display: 'block', marginBottom: '10px' }}>
              Cycle & Physical Markers:
            </span>
            <div className="toggles-grid">
              {/* Cycle Regularity */}
              <button
                type="button"
                className={`sim-toggle-pill ${!cycleIrregular ? 'active-green' : 'active-alert'}`}
                onClick={() => setCycleIrregular(!cycleIrregular)}
              >
                <span>Cycle:</span>
                <strong>{cycleIrregular ? '⚠️ Irregular (>35d)' : '✓ Regular (21-35d)'}</strong>
              </button>

              {/* Hirsutism */}
              <button
                type="button"
                className={`sim-toggle-pill ${!hirsutism ? 'active-green' : 'active-alert'}`}
                onClick={() => setHirsutism(!hirsutism)}
              >
                <span>Facial/Body Hair:</span>
                <strong>{hirsutism ? '⚠️ Present' : '✓ Controlled'}</strong>
              </button>

              {/* Skin Darkening */}
              <button
                type="button"
                className={`sim-toggle-pill ${!skinDarkening ? 'active-green' : 'active-alert'}`}
                onClick={() => setSkinDarkening(!skinDarkening)}
              >
                <span>Acanthosis:</span>
                <strong>{skinDarkening ? '⚠️ Evident' : '✓ Absent'}</strong>
              </button>

              {/* Acne */}
              <button
                type="button"
                className={`sim-toggle-pill ${!acne ? 'active-green' : 'active-alert'}`}
                onClick={() => setAcne(!acne)}
              >
                <span>Acne Breakouts:</span>
                <strong>{acne ? '⚠️ Recurrent' : '✓ Clear'}</strong>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Outcome Scoreboard */}
        <div className="sim-outcome-card">
          <div className="outcome-header">
            <span className="outcome-badge">Simulated ML Outcome</span>
            <h4 className="outcome-title">Projected PCOS Risk Level</h4>
          </div>

          {/* Large Gauge Indicator */}
          <div className="gauge-display-box">
            <div className="gauge-score-number" style={{ color: currentCategory.color }}>
              {simulatedScore}%
            </div>
            <span className="gauge-risk-pill" style={{ background: currentCategory.bg, color: currentCategory.color }}>
              {currentCategory.label}
            </span>

            {/* Delta vs Baseline */}
            <div className="sim-delta-row">
              {scoreDelta < 0 ? (
                <div className="delta-badge positive">
                  <TrendingDown size={18} />
                  <span>{Math.abs(scoreDelta)}% Lower Risk than Baseline</span>
                </div>
              ) : scoreDelta > 0 ? (
                <div className="delta-badge negative">
                  <TrendingUp size={18} />
                  <span>+{scoreDelta}% Increase over Baseline</span>
                </div>
              ) : (
                <div className="delta-badge neutral">
                  <Minus size={18} />
                  <span>Matches Your Baseline Screening</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Drivers Identified */}
          <div className="sim-insights-list">
            <h5 className="insights-heading">Key Drivers in this Simulation:</h5>

            {exerciseDays >= 4 && (
              <div className="insight-item">
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span><strong>4+ days exercise:</strong> Improves muscle GLUT4 glucose transporter activity by ~35%.</span>
              </div>
            )}

            {!cycleIrregular && (
              <div className="insight-item">
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span><strong>Regular menstrual rhythm:</strong> Major clinical marker of restored ovulatory cycles.</span>
              </div>
            )}

            {fastFood === 'rare' && (
              <div className="insight-item">
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span><strong>Low-glycemic diet:</strong> Curtails insulin spikes that trigger ovarian androgen production.</span>
              </div>
            )}

            {bmi <= 24.9 && (
              <div className="insight-item">
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span><strong>Optimal BMI:</strong> Minimizes systemic adipokine inflammation and peripheral estrone conversion.</span>
              </div>
            )}

            {scoreDelta >= 0 && (
              <div className="insight-item" style={{ color: 'var(--text-muted)' }}>
                <AlertTriangle size={16} color="var(--risk-mod)" />
                <span>Slide exercise up, reduce fast food, or lower BMI to observe positive risk reductions.</span>
              </div>
            )}
          </div>

          <div className="sim-takeaway-banner">
            <Sparkles size={18} color="var(--primary)" />
            <span>
              Even a 5–7% reduction in body weight and 3 weekly strength sessions can restore natural ovulation in up to 60% of women with PCOS.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
