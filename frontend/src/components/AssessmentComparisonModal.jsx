import React, { useState } from 'react';
import { X, ArrowRight, TrendingDown, TrendingUp, Minus, CheckCircle2, AlertCircle, Sparkles, Scale } from 'lucide-react';

export default function AssessmentComparisonModal({ history = [], onClose }) {
  if (!history || history.length < 2) return null;

  // Defaults: newest (index 0) vs second newest (index 1)
  const [selectedIdA, setSelectedIdA] = useState(history[0]?.id);
  const [selectedIdB, setSelectedIdB] = useState(history[1]?.id);

  const itemA = history.find(h => h.id === Number(selectedIdA)) || history[0];
  const itemB = history.find(h => h.id === Number(selectedIdB)) || history[1];

  const dateA = new Date(itemA.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateB = new Date(itemB.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Deltas (A compared to B: A is newer, B is baseline)
  const riskDelta = (itemA.risk_score - itemB.risk_score).toFixed(1);
  const bmiDelta = (itemA.bmi - itemB.bmi).toFixed(1);
  const cycleDelta = (itemA.cycle_length - itemB.cycle_length).toFixed(1);

  const symptomList = [
    { key: 'weight_gain', label: 'Rapid Weight Gain' },
    { key: 'hair_growth', label: 'Hirsutism (Excess Hair)' },
    { key: 'skin_darkening', label: 'Acanthosis Nigricans' },
    { key: 'pimples', label: 'Persistent Acne' },
    { key: 'hair_loss', label: 'Scalp Hair Loss' },
    { key: 'fast_food', label: 'Fast Food Frequency' },
    { key: 'reg_exercise', label: 'Regular Exercise', invertPositive: true }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close comparison">
          <X size={20} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={22} color="var(--primary)" />
            Side-by-Side Screening Comparison
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Compare any two clinical screening evaluations to track symptom resolution and health improvements.
          </p>
        </div>

        {/* Dropdown Selectors */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          gap: '16px', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Screening A (Current / Target)
            </label>
            <select
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(Number(e.target.value))}
              className="comparison-select"
            >
              {history.map(h => (
                <option key={h.id} value={h.id}>
                  {new Date(h.created_at).toLocaleDateString()} — {h.risk_score}% ({h.prediction})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }}>
            <ArrowRight size={20} color="var(--text-subtle)" />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Screening B (Baseline / Prior)
            </label>
            <select
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(Number(e.target.value))}
              className="comparison-select"
            >
              {history.map(h => (
                <option key={h.id} value={h.id}>
                  {new Date(h.created_at).toLocaleDateString()} — {h.risk_score}% ({h.prediction})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Metric Delta Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div className="comparison-delta-card">
            <span className="delta-label">Risk Probability Delta</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span className="delta-score" style={{ color: Number(riskDelta) <= 0 ? 'var(--risk-low)' : 'var(--risk-high)' }}>
                {Number(riskDelta) > 0 ? `+${riskDelta}%` : `${riskDelta}%`}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({itemB.risk_score}% → {itemA.risk_score}%)
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: Number(riskDelta) < 0 ? 'var(--risk-low)' : 'var(--text-muted)', fontWeight: 600 }}>
              {Number(riskDelta) < 0 ? '✓ Improved risk profile' : Number(riskDelta) > 0 ? '⚠️ Risk probability increased' : 'Identical score'}
            </span>
          </div>

          <div className="comparison-delta-card">
            <span className="delta-label">BMI Shift</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span className="delta-score" style={{ color: Number(bmiDelta) <= 0 ? 'var(--secondary)' : 'var(--risk-mod)' }}>
                {Number(bmiDelta) > 0 ? `+${bmiDelta}` : `${bmiDelta}`}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({itemB.bmi} → {itemA.bmi})
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Weight: {itemB.weight}kg → {itemA.weight}kg
            </span>
          </div>

          <div className="comparison-delta-card">
            <span className="delta-label">Cycle Duration Shift</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span className="delta-score" style={{ color: 'var(--accent-teal)' }}>
                {Number(cycleDelta) > 0 ? `+${cycleDelta}d` : `${cycleDelta}d`}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({itemB.cycle_length}d → {itemA.cycle_length}d)
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {itemA.cycle_ri === 4 ? 'Irregular Cycle' : 'Regular Cycle'}
            </span>
          </div>
        </div>

        {/* Detailed Markers Matrix */}
        <div style={{ 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border-medium)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>Marker / Symptom</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: 'var(--primary)' }}>Screening A ({dateA})</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Screening B ({dateB})</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Cycle Regularity */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>Cycle Regularity</td>
                <td style={{ textAlign: 'center', padding: '10px 16px' }}>
                  {itemA.cycle_ri === 4 ? <span style={{ color: 'var(--risk-high)', fontWeight: 600 }}>Irregular</span> : <span style={{ color: 'var(--risk-low)', fontWeight: 600 }}>Regular</span>}
                </td>
                <td style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)' }}>
                  {itemB.cycle_ri === 4 ? 'Irregular' : 'Regular'}
                </td>
                <td style={{ textAlign: 'right', padding: '10px 16px' }}>
                  {itemA.cycle_ri === 2 && itemB.cycle_ri === 4 ? (
                    <span style={{ color: 'var(--risk-low)', fontWeight: 600 }}>Normalized ✓</span>
                  ) : itemA.cycle_ri === 4 && itemB.cycle_ri === 2 ? (
                    <span style={{ color: 'var(--risk-high)', fontWeight: 600 }}>Became Irregular ⚠️</span>
                  ) : (
                    <span style={{ color: 'var(--text-subtle)' }}>Unchanged</span>
                  )}
                </td>
              </tr>

              {/* Symptoms */}
              {symptomList.map((sym) => {
                const valA = itemA[sym.key] === 1;
                const valB = itemB[sym.key] === 1;

                let changeStatus = 'Unchanged';
                let statusColor = 'var(--text-subtle)';

                if (sym.invertPositive) {
                  // Exercise: 1 is good, 0 is bad
                  if (valA && !valB) {
                    changeStatus = 'Adopted Routine ✓';
                    statusColor = 'var(--risk-low)';
                  } else if (!valA && valB) {
                    changeStatus = 'Routine Stopped ⚠️';
                    statusColor = 'var(--risk-mod)';
                  }
                } else {
                  // Symptoms/Fast food: 0 is good, 1 is bad
                  if (!valA && valB) {
                    changeStatus = 'Resolved ✓';
                    statusColor = 'var(--risk-low)';
                  } else if (valA && !valB) {
                    changeStatus = 'New Indicator ⚠️';
                    statusColor = 'var(--risk-high)';
                  }
                }

                return (
                  <tr key={sym.key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{sym.label}</td>
                    <td style={{ textAlign: 'center', padding: '10px 16px' }}>
                      {valA ? (
                        <span style={{ color: sym.invertPositive ? 'var(--risk-low)' : 'var(--risk-high)', fontWeight: 600 }}>Yes</span>
                      ) : (
                        <span style={{ color: sym.invertPositive ? 'var(--text-muted)' : 'var(--risk-low)' }}>No</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 16px', color: 'var(--text-muted)' }}>
                      {valB ? 'Yes' : 'No'}
                    </td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600, color: statusColor }}>
                      {changeStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
