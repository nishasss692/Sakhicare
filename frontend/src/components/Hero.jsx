import React from 'react';
import { Sparkles, ShieldCheck, Zap, Activity, Award } from 'lucide-react';

export default function Hero({ onStartAssessment }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Hero Content */}
          <div>
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>AI-Powered Non-Invasive Clinical Screening</span>
            </div>

            <h1 className="hero-title">
              Understand Your Hormonal Health with <span>SakhiCare</span>
            </h1>

            <p className="hero-subtitle">
              Early detection and personalized risk assessment for Polycystic Ovary Syndrome (PCOS) using advanced machine learning on 13 key physiological and lifestyle markers.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={onStartAssessment}>
                <Activity size={20} />
                <span>Start Free Assessment</span>
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="hero-stats">
              <div className="stat-item">
                <h4>86%+</h4>
                <p>Model Accuracy</p>
              </div>
              <div className="stat-item">
                <h4>13 Markers</h4>
                <p>Non-Invasive Analysis</p>
              </div>
              <div className="stat-item">
                <h4>100%</h4>
                <p>Confidential & Secure</p>
              </div>
            </div>
          </div>

          {/* Right Hero Highlights Card */}
          <div>
            <div className="hero-visual-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  background: 'var(--primary-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--primary)' 
                }}>
                  <Award size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>Why Screen Early?</h3>
              </div>

              <div className="feature-pill">
                <div className="feature-pill-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.925rem', marginBottom: '2px' }}>Prevent Complications</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mitigate metabolic and fertility risks with early lifestyle intervention.</p>
                </div>
              </div>

              <div className="feature-pill">
                <div className="feature-pill-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                  <Zap size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.925rem', marginBottom: '2px' }}>Personalized Action Plan</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive customized guidance tailored to your symptoms and body markers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
