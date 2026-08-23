import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  Sparkles, 
  Activity, 
  Stethoscope, 
  Apple, 
  Moon 
} from 'lucide-react';

export default function LearnPCOS({ onStartAssessment }) {
  return (
    <div className="container" style={{ padding: '48px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
        <div className="hero-badge">
          <BookOpen size={16} />
          <span>Clinical Knowledge Hub</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: '14px' }}>
          Understanding PCOS: Symptoms, Science & Care
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Polycystic Ovary Syndrome (PCOS) is a common endocrine disorder affecting 1 in 10 women of reproductive age worldwide. Early detection can reverse insulin resistance and prevent long-term complications.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="learn-grid">
        {/* Rotterdam Criteria Card */}
        <div className="learn-card">
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Stethoscope size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Rotterdam Diagnostic Criteria</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
            Clinically, PCOS is confirmed when at least 2 of the following 3 features are present:
          </p>
          <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
            <li><strong>Oligo- or Anovulation:</strong> Infrequent, irregular, or prolonged menstrual cycles.</li>
            <li><strong>Hyperandrogenism:</strong> Elevated androgens causing acne, hirsutism, or hair thinning.</li>
            <li><strong>Polycystic Ovaries:</strong> Multiple small follicles observed via pelvic ultrasound.</li>
          </ul>
        </div>

        {/* Metabolic Connection Card */}
        <div className="learn-card">
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: '#EDE9FE', 
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Activity size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Insulin Resistance & Weight</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
            Up to 70% of women with PCOS experience insulin resistance, where cells do not respond effectively to insulin:
          </p>
          <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
            <li><strong>Acanthosis Nigricans:</strong> Dark velvety patches on skin folds triggered by excess insulin.</li>
            <li><strong>Stubborn Weight Gain:</strong> Difficulty shedding weight, particularly in the lower abdomen.</li>
            <li><strong>Sugar Cravings:</strong> Energy crashes and intense cravings for high-glycemic carbohydrates.</li>
          </ul>
        </div>

        {/* Nutrition & Lifestyle Card */}
        <div className="learn-card">
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: '#ECFDF5', 
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Apple size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Evidence-Based Lifestyle Steps</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
            Lifestyle modifications are universally recognized as the foundational first-line therapy:
          </p>
          <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
            <li><strong>Anti-Inflammatory Nutrition:</strong> High fiber, lean proteins, healthy fats, and low glycemic index meals.</li>
            <li><strong>Strength & Zone 2 Training:</strong> Builds muscle insulin receptors and lowers cortisol spikes.</li>
            <li><strong>Circadian Rest:</strong> 7–8 hours of quality sleep to balance melatonin and reproductive hormones.</li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div style={{
        marginTop: '48px',
        background: 'var(--bg-gradient-hero)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Ready to check your risk profile?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
          Take the 2-minute non-invasive assessment powered by our validated Random Forest machine learning classifier.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onStartAssessment}>
          <Sparkles size={18} />
          <span>Start Assessment Now</span>
        </button>
      </div>
    </div>
  );
}
