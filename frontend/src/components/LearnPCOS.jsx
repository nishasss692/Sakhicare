import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  Apple, 
  Moon 
} from 'lucide-react';

export default function LearnPCOS({ onStartAssessment }) {
  return (
    <div className="container" style={{ padding: '80px 24px 80px 24px' }}>
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

      {/* Nutritional Guidance & Dietary Pillars Section */}
      <div style={{ marginTop: '56px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px auto' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Anti-Inflammatory Nutritional Pillars</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Dietary modifications provide targeted support for insulin sensitivity, androgen balance, and systemic inflammation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#0D9488', letterSpacing: '0.5px' }}>Anti-Androgen</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Organic Spearmint Tea</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Clinically shown in trials to significantly reduce free testosterone and mild hirsutism in women with PCOS. Enjoy 1–2 cups daily.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#D97706', letterSpacing: '0.5px' }}>Insulin Sensitizer</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Ceylon Cinnamon</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Facilitates cellular glucose uptake and smooths postprandial glucose curves. Add 1/2 tsp to morning oats or chia pudding.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#E11D48', letterSpacing: '0.5px' }}>Anti-Inflammatory</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Omega-3 Fatty Acids</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Found in wild salmon, walnuts, and chia seeds. Helps calm chronic low-grade ovarian inflammation and lower triglycerides.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#8B5CF6', letterSpacing: '0.5px' }}>Hormone Clearance</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Ground Flaxseeds</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Rich in lignans that increase Sex Hormone Binding Globulin (SHBG), binding excess circulating free androgens.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.5px' }}>Zinc & DHT Defense</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Pumpkin & Sesame Seeds</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Bioavailable zinc naturally inhibits the 5-alpha reductase enzyme responsible for DHT-related acne and hair thinning.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#16A34A', letterSpacing: '0.5px' }}>Estrogen Metabolism</span>
            <h4 style={{ fontSize: '1.05rem', margin: '6px 0 8px 0' }}>Cruciferous Greens</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Broccoli, kale, and Brussels sprouts contain Indole-3-Carbinol (I3C) and DIM to support Phase 2 liver hormone clearance.
            </p>
          </div>
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
          Take the 2-minute non-invasive assessment evaluated across 13 key physiological and lifestyle markers.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onStartAssessment}>
          <Activity size={18} />
          <span>Start Assessment Now</span>
        </button>
      </div>
    </div>
  );
}
