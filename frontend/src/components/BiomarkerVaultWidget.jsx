import React, { useState, useEffect, useMemo } from 'react';
import { 
  FlaskConical, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  Info, 
  Save, 
  RotateCcw,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

const DEFAULT_LABS = {
  glucose: 92,
  insulin: 14.5,
  lh: 13.8,
  fsh: 5.4,
  testosterone: 62,
  dheas: 290,
  tsh: 2.1,
  vitaminD: 22
};

export default function BiomarkerVaultWidget() {
  const [labs, setLabs] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhicare_biomarkers');
      return saved ? JSON.parse(saved) : DEFAULT_LABS;
    } catch {
      return DEFAULT_LABS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, val) => {
    const num = parseFloat(val);
    setLabs(prev => ({
      ...prev,
      [field]: isNaN(num) ? '' : num
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('sakhicare_biomarkers', JSON.stringify(labs));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetToDefault = () => {
    setLabs(DEFAULT_LABS);
  };

  // Clinical Calculators
  // 1. HOMA-IR = (Glucose * Insulin) / 405
  const homaIR = useMemo(() => {
    if (!labs.glucose || !labs.insulin) return null;
    const val = (Number(labs.glucose) * Number(labs.insulin)) / 405;
    return parseFloat(val.toFixed(2));
  }, [labs.glucose, labs.insulin]);

  // 2. LH : FSH Ratio
  const lhFshRatio = useMemo(() => {
    if (!labs.lh || !labs.fsh || labs.fsh === 0) return null;
    const val = Number(labs.lh) / Number(labs.fsh);
    return parseFloat(val.toFixed(2));
  }, [labs.lh, labs.fsh]);

  return (
    <div className="biomarker-vault-container">
      {/* Top Banner */}
      <div className="biomarker-header">
        <div className="bio-title-wrap">
          <div className="bio-icon-badge">
            <FlaskConical size={24} color="#0D9488" />
          </div>
          <div>
            <h3 className="widget-title">Clinical Lab Biomarker Vault</h3>
            <p className="widget-subtitle">
              Log verified bloodwork, compute insulin resistance (HOMA-IR), track the LH/FSH ratio, and review clinical reference ranges.
            </p>
          </div>
        </div>

        <div className="bio-header-actions">
          <button className="bio-btn outline" onClick={handleResetToDefault} title="Load sample PCOS lab work">
            <RotateCcw size={15} />
            <span>Load Sample Panel</span>
          </button>
          <button className="bio-btn primary" onClick={handleSave}>
            <Save size={15} />
            <span>{savedSuccess ? 'Saved ✓' : 'Save Lab Values'}</span>
          </button>
        </div>
      </div>

      {/* Calculated Clinical Indexes Highlight Row */}
      <div className="biomarker-kpi-row">
        {/* HOMA-IR Calculator Card */}
        <div className="clinical-calc-card">
          <div className="calc-card-top">
            <span className="calc-card-tag">Automated Index</span>
            <Calculator size={18} color="var(--primary)" />
          </div>
          <div className="calc-card-title">HOMA-IR (Insulin Resistance Index)</div>
          <div className="calc-main-stat">
            <span className="calc-number" style={{
              color: !homaIR ? 'var(--text-muted)' : homaIR < 1.4 ? 'var(--risk-low)' : homaIR < 2.0 ? 'var(--risk-mod)' : 'var(--risk-high)'
            }}>
              {homaIR !== null ? homaIR : '—'}
            </span>
            <span className="calc-status-badge" style={{
              background: !homaIR ? '#F3F4F6' : homaIR < 1.4 ? 'var(--risk-low-bg)' : homaIR < 2.0 ? 'var(--risk-mod-bg)' : 'var(--risk-high-bg)',
              color: !homaIR ? 'var(--text-muted)' : homaIR < 1.4 ? 'var(--risk-low)' : homaIR < 2.0 ? 'var(--risk-mod)' : 'var(--risk-high)'
            }}>
              {!homaIR ? 'Awaiting inputs' : homaIR < 1.4 ? 'Optimal Sensitivity' : homaIR < 2.0 ? 'Mild Resistance' : 'Significant Insulin Resistance'}
            </span>
          </div>
          <p className="calc-description">
            Formula: <code>(Fasting Glucose × Fasting Insulin) ÷ 405</code>. Values &gt; 1.9 indicate cellular insulin resistance common in PCOS.
          </p>
        </div>

        {/* LH:FSH Ratio Card */}
        <div className="clinical-calc-card">
          <div className="calc-card-top">
            <span className="calc-card-tag">Endocrine Pattern</span>
            <Activity size={18} color="#8B5CF6" />
          </div>
          <div className="calc-card-title">LH to FSH Secretion Ratio</div>
          <div className="calc-main-stat">
            <span className="calc-number" style={{
              color: !lhFshRatio ? 'var(--text-muted)' : lhFshRatio < 1.5 ? 'var(--risk-low)' : lhFshRatio < 2.0 ? 'var(--risk-mod)' : 'var(--risk-high)'
            }}>
              {lhFshRatio !== null ? `${lhFshRatio} : 1` : '—'}
            </span>
            <span className="calc-status-badge" style={{
              background: !lhFshRatio ? '#F3F4F6' : lhFshRatio < 1.5 ? 'var(--risk-low-bg)' : lhFshRatio < 2.0 ? 'var(--risk-mod-bg)' : 'var(--risk-high-bg)',
              color: !lhFshRatio ? 'var(--text-muted)' : lhFshRatio < 1.5 ? 'var(--risk-low)' : lhFshRatio < 2.0 ? 'var(--risk-mod)' : 'var(--risk-high)'
            }}>
              {!lhFshRatio ? 'Awaiting inputs' : lhFshRatio < 1.5 ? 'Normal 1:1 Secretion' : lhFshRatio < 2.0 ? 'Borderline Skew' : 'Classic PCOS Inversion (>2:1)'}
            </span>
          </div>
          <p className="calc-description">
            In healthy cycles, Day 2–4 LH and FSH are roughly 1:1. PCOS patients often demonstrate LH:FSH ratios &gt; 2:1, impairing follicular maturation.
          </p>
        </div>
      </div>

      {/* Biomarker Inputs & Reference Gauges Grid */}
      <div className="biomarker-inputs-grid">
        {/* Glucose */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">Fasting Glucose (mg/dL)</label>
            <span className={`bio-status-pill ${labs.glucose <= 99 ? 'status-good' : labs.glucose <= 125 ? 'status-warn' : 'status-alert'}`}>
              {labs.glucose <= 99 ? 'Normal' : labs.glucose <= 125 ? 'Pre-diabetic' : 'High'}
            </span>
          </div>
          <input
            type="number"
            className="bio-input-field"
            value={labs.glucose}
            onChange={(e) => handleChange('glucose', e.target.value)}
            placeholder="e.g. 92"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Clinical Target: 70–99 mg/dL</span>
          </div>
        </div>

        {/* Insulin */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">Fasting Insulin (μIU/mL)</label>
            <span className={`bio-status-pill ${labs.insulin <= 10 ? 'status-good' : labs.insulin <= 15 ? 'status-warn' : 'status-alert'}`}>
              {labs.insulin <= 10 ? 'Optimal' : labs.insulin <= 15 ? 'Elevated' : 'High IR'}
            </span>
          </div>
          <input
            type="number"
            step="0.1"
            className="bio-input-field"
            value={labs.insulin}
            onChange={(e) => handleChange('insulin', e.target.value)}
            placeholder="e.g. 12.5"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Optimal: &lt; 10 μIU/mL (Labs often report up to 25)</span>
          </div>
        </div>

        {/* LH */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">LH (Luteinizing Hormone) (mIU/mL)</label>
            <span className="bio-status-pill status-neutral">Day 2–4 Baseline</span>
          </div>
          <input
            type="number"
            step="0.1"
            className="bio-input-field"
            value={labs.lh}
            onChange={(e) => handleChange('lh', e.target.value)}
            placeholder="e.g. 13.5"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Follicular phase reference: 2.0 – 12.0 mIU/mL</span>
          </div>
        </div>

        {/* FSH */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">FSH (Follicle Hormone) (mIU/mL)</label>
            <span className="bio-status-pill status-neutral">Day 2–4 Baseline</span>
          </div>
          <input
            type="number"
            step="0.1"
            className="bio-input-field"
            value={labs.fsh}
            onChange={(e) => handleChange('fsh', e.target.value)}
            placeholder="e.g. 5.5"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Follicular phase reference: 3.5 – 10.0 mIU/mL</span>
          </div>
        </div>

        {/* Total Testosterone */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">Total Testosterone (ng/dL)</label>
            <span className={`bio-status-pill ${labs.testosterone <= 45 ? 'status-good' : labs.testosterone <= 60 ? 'status-warn' : 'status-alert'}`}>
              {labs.testosterone <= 45 ? 'Normal' : 'Hyperandrogenic'}
            </span>
          </div>
          <input
            type="number"
            step="0.5"
            className="bio-input-field"
            value={labs.testosterone}
            onChange={(e) => handleChange('testosterone', e.target.value)}
            placeholder="e.g. 55"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Reference Range: 15 – 50 ng/dL</span>
          </div>
        </div>

        {/* DHEA-S */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">DHEA-Sulfate (Adrenal) (μg/dL)</label>
            <span className={`bio-status-pill ${labs.dheas <= 300 ? 'status-good' : 'status-alert'}`}>
              {labs.dheas <= 300 ? 'Normal' : 'Adrenal Drive'}
            </span>
          </div>
          <input
            type="number"
            className="bio-input-field"
            value={labs.dheas}
            onChange={(e) => handleChange('dheas', e.target.value)}
            placeholder="e.g. 280"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Reference: 65 – 380 μg/dL (age dependent)</span>
          </div>
        </div>

        {/* TSH */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">TSH (Thyroid Function) (μIU/mL)</label>
            <span className={`bio-status-pill ${labs.tsh >= 0.5 && labs.tsh <= 2.5 ? 'status-good' : 'status-warn'}`}>
              {labs.tsh >= 0.5 && labs.tsh <= 2.5 ? 'Optimal' : 'Investigate'}
            </span>
          </div>
          <input
            type="number"
            step="0.1"
            className="bio-input-field"
            value={labs.tsh}
            onChange={(e) => handleChange('tsh', e.target.value)}
            placeholder="e.g. 2.0"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Fertility Target: 0.5 – 2.5 μIU/mL</span>
          </div>
        </div>

        {/* Vitamin D */}
        <div className="bio-field-card">
          <div className="bio-field-top">
            <label className="bio-label">Vitamin D (25-OH) (ng/mL)</label>
            <span className={`bio-status-pill ${labs.vitaminD >= 30 ? 'status-good' : labs.vitaminD >= 20 ? 'status-warn' : 'status-alert'}`}>
              {labs.vitaminD >= 30 ? 'Sufficient' : 'Deficient'}
            </span>
          </div>
          <input
            type="number"
            className="bio-input-field"
            value={labs.vitaminD}
            onChange={(e) => handleChange('vitaminD', e.target.value)}
            placeholder="e.g. 35"
          />
          <div className="bio-range-meter">
            <span className="meter-label">Optimal: 30 – 80 ng/mL (Vital for follicular health)</span>
          </div>
        </div>
      </div>

      {/* Clinical Guidance Box */}
      <div className="bio-guidance-box">
        <Sparkles size={20} color="#0D9488" />
        <div className="guidance-content">
          <h6>Why Tracking Biomarkers Matters in PCOS</h6>
          <p>
            Up to 80% of women with PCOS exhibit silent insulin resistance that standard fasting glucose tests alone miss. Calculating your <strong>HOMA-IR</strong> and checking your <strong>LH:FSH ratio</strong> gives your medical team actionable precision data for targeted metabolic therapy.
          </p>
        </div>
      </div>
    </div>
  );
}
