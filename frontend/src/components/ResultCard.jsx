import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  FileText, 
  RotateCcw, 
  HeartHandshake, 
  Stethoscope, 
  Activity, 
  History 
} from 'lucide-react';

export default function ResultCard({ result, onRetake, onGoToHistory }) {
  const { risk_score, risk_level, pcos_detected, recommendation, contributing_factors } = result;

  // Circumference for 190px radial gauge (radius = 76)
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk_score / 100) * circumference;

  let riskClass = 'low-risk';
  let strokeColor = '#10B981';
  let RiskIcon = CheckCircle2;

  if (risk_level === 'High Risk') {
    riskClass = 'high-risk';
    strokeColor = '#E11D48';
    RiskIcon = AlertOctagon;
  } else if (risk_level === 'Moderate Risk') {
    riskClass = 'mod-risk';
    strokeColor = '#F59E0B';
    RiskIcon = AlertTriangle;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="assessment-container">
      <div className="container">
        <div className="results-card">
          {/* Header with Animated Radial Risk Gauge */}
          <div className={`results-header ${riskClass}`}>
            <div className="gauge-wrapper">
              <svg className="gauge-svg" width="190" height="190">
                <circle
                  className="gauge-bg"
                  cx="95"
                  cy="95"
                  r={radius}
                />
                <circle
                  className="gauge-fill"
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke={strokeColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              <div className="gauge-center-text">
                <div className="gauge-number" style={{ color: strokeColor }}>
                  {risk_score}%
                </div>
                <div className="gauge-label">Estimated Risk</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div className={`risk-badge ${riskClass}`}>
                <RiskIcon size={18} />
                <span>{risk_level}</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginTop: '12px' }}>
              {pcos_detected ? 'Indicators of PCOS Detected' : 'Low Clinical PCOS Risk'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '4px auto 0 auto' }}>
              Evaluated against 13 key physiological and hormonal markers based on clinical screening parameters.
            </p>
          </div>

          {/* Results Body */}
          <div className="results-body">
            {/* Contributing Symptom Factors */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>Detected Symptom Drivers</h3>
              </div>

              {contributing_factors && contributing_factors.length > 0 ? (
                <div className="factors-chip-list">
                  {contributing_factors.map((factor, idx) => (
                    <div key={idx} className="factor-chip">
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: 'var(--primary)' 
                      }} />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  No major adverse lifestyle or symptomatic drivers were flagged.
                </p>
              )}
            </div>

            {/* Medical & Lifestyle Recommendations */}
            <div className="recommendation-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Stethoscope size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-heading)' }}>Clinical & Lifestyle Guidance</h3>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: '1.65' }}>
                {recommendation}
              </p>
            </div>

            {/* Recommended Diagnostic Panel */}
            <div style={{ 
              marginTop: '24px', 
              padding: '18px 20px', 
              background: '#F9FAFB', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-medium)' 
            }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartHandshake size={18} color="var(--secondary)" />
                Recommended Clinical Next Steps
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <li><strong>Pelvic Ultrasound (USG):</strong> To check for polycystic ovarian morphology (12+ antral follicles).</li>
                <li><strong>Hormone Panel:</strong> Fasting blood tests for LH, FSH, Free Testosterone, and AMH.</li>
                <li><strong>Metabolic Screening:</strong> Fasting blood glucose & HbA1c to assess insulin resistance.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '36px', 
              flexWrap: 'wrap', 
              gap: '12px' 
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={onRetake}>
                  <RotateCcw size={16} />
                  <span>Retake Screening</span>
                </button>
                <button className="btn btn-secondary" onClick={handlePrint}>
                  <FileText size={16} />
                  <span>Print Report</span>
                </button>
              </div>

              <button className="btn btn-primary" onClick={onGoToHistory}>
                <History size={18} />
                <span>View in History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
