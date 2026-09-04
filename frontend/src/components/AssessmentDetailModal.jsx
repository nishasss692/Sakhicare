import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Activity, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle,
  Heart,
  Scale,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AssessmentDetailModal({ 
  assessment, 
  onClose, 
  onDelete, 
  onOpenReport 
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!assessment) return null;

  const dateStr = new Date(assessment.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let riskClass = 'low-risk';
  let badgeColor = 'var(--risk-low)';
  let badgeBg = 'var(--risk-low-bg)';
  if (assessment.prediction === 'High Risk') {
    riskClass = 'high-risk';
    badgeColor = 'var(--risk-high)';
    badgeBg = 'var(--risk-high-bg)';
  } else if (assessment.prediction === 'Moderate Risk') {
    riskClass = 'mod-risk';
    badgeColor = 'var(--risk-mod)';
    badgeBg = 'var(--risk-mod-bg)';
  }

  // BMI categorization
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'var(--risk-low)';
  if (assessment.bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#3B82F6';
  } else if (assessment.bmi >= 25 && assessment.bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'var(--risk-mod)';
  } else if (assessment.bmi >= 30) {
    bmiCategory = 'Obesity Category';
    bmiColor = 'var(--risk-high)';
  }

  const symptoms = [
    { label: 'Hirsutism (Excess Facial / Body Hair)', present: assessment.hair_growth === 1 },
    { label: 'Acanthosis Nigricans (Skin Darkening)', present: assessment.skin_darkening === 1 },
    { label: 'Persistent Acne / Breakouts', present: assessment.pimples === 1 },
    { label: 'Hair Thinning / Scalp Loss', present: assessment.hair_loss === 1 },
    { label: 'Rapid / Unexplained Weight Gain', present: assessment.weight_gain === 1 },
  ];

  const lifestyle = [
    { label: 'Frequent Processed / Fast Food Intake', present: assessment.fast_food === 1, warningIf: true },
    { label: 'Regular Physical Exercise Routine', present: assessment.reg_exercise === 1, warningIf: false }
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(assessment.id);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: badgeBg,
            color: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            border: `1px solid ${badgeColor}33`
          }}>
            {assessment.risk_score}%
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={`risk-badge ${riskClass}`} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                {assessment.prediction}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Record #{assessment.id}
              </span>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <Calendar size={14} />
              <span>{dateStr}</span>
            </div>
          </div>
        </div>

        {/* Biometrics & Menstrual Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div className="detail-stat-tile">
            <span className="tile-label">Age</span>
            <span className="tile-value">{assessment.age} yrs</span>
          </div>

          <div className="detail-stat-tile">
            <span className="tile-label">Height / Weight</span>
            <span className="tile-value">{assessment.height}cm / {assessment.weight}kg</span>
          </div>

          <div className="detail-stat-tile">
            <span className="tile-label">BMI</span>
            <span className="tile-value" style={{ color: bmiColor }}>
              {assessment.bmi}
              <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 500 }}>{bmiCategory}</span>
            </span>
          </div>

          <div className="detail-stat-tile">
            <span className="tile-label">Cycle Regularity</span>
            <span className="tile-value">
              {assessment.cycle_ri === 4 ? (
                <span style={{ color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> Irregular
                </span>
              ) : (
                <span style={{ color: 'var(--risk-low)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Regular
                </span>
              )}
              <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500 }}>
                {assessment.cycle_length} days duration
              </span>
            </span>
          </div>
        </div>

        {/* Physical Symptoms Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--primary)" />
            Reported Clinical Symptoms
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {symptoms.map((sym, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: sym.present ? 'var(--risk-high-bg)' : '#F9FAFB',
                  border: `1px solid ${sym.present ? 'var(--risk-high-border)' : 'var(--border-medium)'}`
                }}
              >
                <span style={{ fontSize: '0.85rem', color: sym.present ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                  {sym.label}
                </span>
                {sym.present ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--risk-high)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <AlertCircle size={16} /> Present
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--risk-low)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Not Present
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={16} color="var(--primary)" />
            Lifestyle Habits
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            {lifestyle.map((life, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#F9FAFB',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{life.label}</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  color: life.present === life.warningIf ? 'var(--risk-mod)' : 'var(--risk-low)'
                }}>
                  {life.present ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        {assessment.recommendation && (
          <div style={{
            background: 'var(--primary-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            borderLeft: '4px solid var(--primary)',
            marginBottom: '28px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Sparkles size={16} />
              AI Clinical Recommendation
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.55' }}>
              {assessment.recommendation}
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Delete Action */}
          <div>
            {!confirmDelete ? (
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ color: 'var(--risk-high)', borderColor: '#FDA4AF', padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={16} />
                <span>Delete Entry</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--risk-high)' }}>Confirm delete?</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: 'var(--risk-high)', padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => {
                onOpenReport(assessment);
                onClose();
              }}
            >
              <Printer size={16} />
              <span>Doctor Printout</span>
            </button>

            <button 
              type="button" 
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
