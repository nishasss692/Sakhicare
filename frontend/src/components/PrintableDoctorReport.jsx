import React from 'react';
import { Printer, X, FileText, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export default function PrintableDoctorReport({ assessment, user, onClose }) {
  if (!assessment) return null;

  const dateStr = new Date(assessment.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop print-modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content print-document-container"
        style={{ maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '40px', background: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Print Controls Bar - hidden on paper print */}
        <div className="no-print" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Doctor Consultation Summary Printout</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={handlePrint} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>
            <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="printable-report-body" id="doctor-printable-sheet">
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--primary)',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.4rem' }}>
                <Heart size={24} fill="var(--primary)" />
                <span>SakhiCare Clinical Screening Report</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '4px' }}>
                Non-Invasive AI Polycystic Ovary Syndrome (PCOS) Risk & Symptom Assessment
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
              <div><strong>Record ID:</strong> #{assessment.id}</div>
              <div><strong>Assessment Date:</strong> {dateStr}</div>
              {user?.email && <div><strong>User ID:</strong> {user.email}</div>}
            </div>
          </div>

          {/* Clinical Risk Summary Alert Box */}
          <div style={{ 
            padding: '16px 20px', 
            background: assessment.prediction === 'High Risk' ? '#FFF1F2' : assessment.prediction === 'Moderate Risk' ? '#FFFBEB' : '#ECFDF5',
            border: `1px solid ${assessment.prediction === 'High Risk' ? '#FDA4AF' : assessment.prediction === 'Moderate Risk' ? '#FCD34D' : '#6EE7B7'}`,
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#475569' }}>
                Machine Learning Screening Assessment
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: assessment.prediction === 'High Risk' ? '#E11D48' : assessment.prediction === 'Moderate Risk' ? '#D97706' : '#059669', marginTop: '2px' }}>
                {assessment.prediction} ({assessment.risk_score}% Calculated Probability)
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.825rem', color: '#475569', maxWidth: '300px' }}>
              Evaluated using 13 non-invasive clinical, menstrual, and phenotypic markers via Random Forest Classifier.
            </div>
          </div>

          {/* Section 1: Biometrics & Menstrual Profile */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px', marginBottom: '12px' }}>
              1. Biometrics & Menstrual Cycle Profile
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Patient Age</span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{assessment.age} years</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Height & Weight</span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{assessment.height} cm / {assessment.weight} kg</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Body Mass Index</span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{assessment.bmi} kg/m²</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Cycle Regularity</span>
                <strong style={{ fontSize: '1rem', color: assessment.cycle_ri === 4 ? '#E11D48' : '#059669' }}>
                  {assessment.cycle_ri === 4 ? 'Irregular' : 'Regular'} ({assessment.cycle_length}d)
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Phenotypic Markers (Rotterdam Criteria Context) */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px', marginBottom: '12px' }}>
              2. Reported Phenotypic Symptoms (Rotterdam Alignment)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Hirsutism (Excess facial / body hair growth)</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.hair_growth === 1 ? '#E11D48' : '#64748B' }}>
                    {assessment.hair_growth === 1 ? 'Positive (+)' : 'Negative (-)'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Acanthosis Nigricans (Insulin resistance skin darkening)</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.skin_darkening === 1 ? '#E11D48' : '#64748B' }}>
                    {assessment.skin_darkening === 1 ? 'Positive (+)' : 'Negative (-)'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Persistent Acne / Breakouts</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.pimples === 1 ? '#E11D48' : '#64748B' }}>
                    {assessment.pimples === 1 ? 'Positive (+)' : 'Negative (-)'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Hair Loss / Androgenic Alopecia thinning</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.hair_loss === 1 ? '#E11D48' : '#64748B' }}>
                    {assessment.hair_loss === 1 ? 'Positive (+)' : 'Negative (-)'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Rapid or Unexplained Weight Gain</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.weight_gain === 1 ? '#E11D48' : '#64748B' }}>
                    {assessment.weight_gain === 1 ? 'Positive (+)' : 'Negative (-)'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Frequent Fast Food / Processed Carbohydrate Intake</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.fast_food === 1 ? '#D97706' : '#059669' }}>
                    {assessment.fast_food === 1 ? 'Yes (Risk Factor)' : 'No (Low)'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', color: '#334155' }}>Regular Physical Exercise (&gt;150 min/week)</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: assessment.reg_exercise === 1 ? '#059669' : '#D97706' }}>
                    {assessment.reg_exercise === 1 ? 'Active (Protective)' : 'Sedentary'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Recommended Clinical Confirmatory Tests */}
          <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0F172A', marginBottom: '8px' }}>
              Suggested Confirmatory Workup for Attending Physician
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.825rem', color: '#334155', lineHeight: '1.6' }}>
              <li><strong>Pelvic Ultrasound (TVS/USG):</strong> Assess ovarian volume (&gt;10 cm³) and antral follicle count (&ge;12 follicles measuring 2-9 mm).</li>
              <li><strong>Serum Hormone Panel:</strong> LH, FSH (LH:FSH ratio &gt; 2:1), Total & Free Testosterone, DHEA-S, and 17-OHP (to rule out CAH).</li>
              <li><strong>Metabolic Profile:</strong> Fasting Plasma Glucose, Fasting Insulin (HOMA-IR), HbA1c, and Lipid Profile.</li>
              <li><strong>Endocrine Exclusions:</strong> TSH (Thyroid dysfunction) and Serum Prolactin (Hyperprolactinemia).</li>
            </ul>
          </div>

          {/* Section 4: Clinical Guidance Note */}
          <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <strong>Physician Disclaimer:</strong> This summary is generated by SakhiCare as a patient self-reported screening aid to assist clinical consultations. It does not replace independent medical evaluation, physical examination, or formal diagnostic criteria.
          </div>
        </div>
      </div>
    </div>
  );
}
