import React, { useState } from 'react';
import { Moon, Sun, Sparkles, Apple, Dumbbell, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export default function HormonePhaseWidget({ userCycleLength = 28 }) {
  const [cycleDay, setCycleDay] = useState(10);
  const [expandedTip, setExpandedTip] = useState('nutrition'); // 'nutrition' | 'fitness' | 'hormones'

  const effectiveCycle = Math.max(21, Math.min(60, Number(userCycleLength) || 28));

  // Determine phases proportionally based on user's cycle length
  const menstrualEnd = 5;
  const ovulatoryDay = Math.round(effectiveCycle - 14);
  const follicularEnd = ovulatoryDay - 1;
  const ovulatoryEnd = ovulatoryDay + 2;

  let currentPhase = {
    name: 'Follicular Phase',
    badgeClass: 'phase-follicular',
    tagline: 'Estrogen Rising & Metabolic Vitality',
    description: 'Follicles are maturing in the ovaries and your insulin sensitivity is at its monthly peak.',
    hormones: 'Estrogen: Rising | Progesterone: Low | LH: Baseline',
    energy: 'High & Rising',
    nutrition: 'Focus on sprouted seeds (pumpkin, flax for seed cycling), lean proteins, and cruciferous veggies (broccoli, cauliflower) that help liver metabolism of estrogen.',
    fitness: 'Best time for progressive strength training, HIIT, and higher intensity workouts as insulin sensitivity and muscle recovery are optimal.',
    pcosCare: 'Crucial window for metabolic support: high fiber intake prevents glucose spikes which reduces excess ovarian androgen production.'
  };

  if (cycleDay <= menstrualEnd) {
    currentPhase = {
      name: 'Menstrual Phase',
      badgeClass: 'phase-menstrual',
      tagline: 'Restoration, Low Hormone Baseline & Reset',
      description: 'The uterine lining sheds as estrogen and progesterone reach their lowest concentration.',
      hormones: 'Estrogen: Low | Progesterone: Low | LH: Low',
      energy: 'Inward & Restorative',
      nutrition: 'Iron-rich foods (spinach, lentils, dark chocolate), bone broth, turmeric, and magnesium-rich pumpkin seeds to ease uterine cramping.',
      fitness: 'Gentle restorative yoga, slow walking, and light stretching. Avoid strenuous exhausting workouts.',
      pcosCare: 'Prioritize restorative sleep to lower cortisol, a primary trigger for insulin resistance in PCOS.'
    };
  } else if (cycleDay >= ovulatoryDay - 1 && cycleDay <= ovulatoryEnd) {
    currentPhase = {
      name: 'Ovulatory Phase',
      badgeClass: 'phase-ovulatory',
      tagline: 'Luteinizing Hormone (LH) Peak & Fertility Window',
      description: 'Estrogen peaks, triggering the LH surge. In PCOS, LH levels may remain elevated or ovulation can be delayed.',
      hormones: 'Estrogen: Peak | LH: High (Surge) | Testosterone: Slight rise',
      energy: 'Peak Social & Physical Endurance',
      nutrition: 'Antioxidant-dense berries, wild salmon (omega-3s), leafy greens, and ample hydration to support liver clearance.',
      fitness: 'High-intensity interval training, circuit workouts, cycling, or energetic strength sessions.',
      pcosCare: 'Keep glycemic index low. Elevated insulin during ovulation can worsen androgen symptoms like facial hair or breakouts.'
    };
  } else if (cycleDay > ovulatoryEnd) {
    currentPhase = {
      name: 'Luteal Phase',
      badgeClass: 'phase-luteal',
      tagline: 'Progesterone Dominance & Metabolic Shift',
      description: 'The corpus luteum produces progesterone. Metabolism increases slightly, which can induce sugar cravings in PCOS.',
      hormones: 'Progesterone: Peak | Estrogen: Moderate secondary peak',
      energy: 'Moderate to Calming',
      nutrition: 'Complex slow carbs (sweet potatoes, quinoa, oats), sunflower/sesame seeds (luteal seed cycling), and vitamin B6 to stabilize mood.',
      fitness: 'Moderate resistance training, Pilates, and steady-state walking. Avoid extreme exhaustion close to menstruation.',
      pcosCare: 'Prevent sugar cravings with healthy fats and protein every 3-4 hours to stop insulin surges from exacerbating PMS acne.'
    };
  }

  return (
    <div className="hormone-phase-card">
      <div className="phase-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="phase-icon-bubble">
            <Sparkles size={20} color="#C026D3" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Cycle & Hormonal Phase Companion</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Phase-synced nutrition, fitness, and PCOS endocrine insights for Day {cycleDay} of {effectiveCycle}.
            </p>
          </div>
        </div>

        <span className={`phase-status-badge ${currentPhase.badgeClass}`}>
          {currentPhase.name}
        </span>
      </div>

      {/* Cycle Day Slider */}
      <div className="cycle-slider-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Current Cycle Day: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>Day {cycleDay}</strong>
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cycle Length: {effectiveCycle} days
          </span>
        </div>

        <input
          type="range"
          min="1"
          max={effectiveCycle}
          value={cycleDay}
          onChange={(e) => setCycleDay(Number(e.target.value))}
          className="cycle-range-input"
          aria-label="Current Cycle Day"
        />

        {/* Phase Bar Visual */}
        <div className="phase-bar-track">
          <div className="phase-segment menstrual" style={{ width: `${(menstrualEnd / effectiveCycle) * 100}%` }} title="Menstrual">
            <span>Menstrual</span>
          </div>
          <div className="phase-segment follicular" style={{ width: `${((follicularEnd - menstrualEnd) / effectiveCycle) * 100}%` }} title="Follicular">
            <span>Follicular</span>
          </div>
          <div className="phase-segment ovulatory" style={{ width: `${((ovulatoryEnd - follicularEnd) / effectiveCycle) * 100}%` }} title="Ovulatory">
            <span>Ovulatory</span>
          </div>
          <div className="phase-segment luteal" style={{ width: `${((effectiveCycle - ovulatoryEnd) / effectiveCycle) * 100}%` }} title="Luteal">
            <span>Luteal</span>
          </div>
        </div>
      </div>

      {/* Phase Highlights */}
      <div className="phase-content-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '4px' }}>
              {currentPhase.tagline}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
              {currentPhase.description}
            </p>
          </div>
          <div className="phase-hormone-pill">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>
              {currentPhase.hormones}
            </span>
          </div>
        </div>

        {/* Interactive Tip Tabs */}
        <div className="phase-tabs-row">
          <button
            type="button"
            className={`phase-tab-btn ${expandedTip === 'nutrition' ? 'active' : ''}`}
            onClick={() => setExpandedTip('nutrition')}
          >
            <Apple size={15} />
            <span>PCOS Diet & Seed Cycling</span>
          </button>
          <button
            type="button"
            className={`phase-tab-btn ${expandedTip === 'fitness' ? 'active' : ''}`}
            onClick={() => setExpandedTip('fitness')}
          >
            <Dumbbell size={15} />
            <span>Movement & Cortisol Balance</span>
          </button>
          <button
            type="button"
            className={`phase-tab-btn ${expandedTip === 'hormones' ? 'active' : ''}`}
            onClick={() => setExpandedTip('hormones')}
          >
            <ShieldCheck size={15} />
            <span>Insulin & Androgen Protection</span>
          </button>
        </div>

        <div className="phase-tab-detail-card">
          {expandedTip === 'nutrition' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="tip-badge green"><Apple size={18} /></div>
              <div>
                <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '2px', color: 'var(--text-heading)' }}>
                  Phase Nutrition Guidance
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {currentPhase.nutrition}
                </p>
              </div>
            </div>
          )}

          {expandedTip === 'fitness' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="tip-badge purple"><Dumbbell size={18} /></div>
              <div>
                <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '2px', color: 'var(--text-heading)' }}>
                  Movement Strategy
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {currentPhase.fitness}
                </p>
              </div>
            </div>
          )}

          {expandedTip === 'hormones' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="tip-badge pink"><ShieldCheck size={18} /></div>
              <div>
                <strong style={{ fontSize: '0.875rem', display: 'block', marginBottom: '2px', color: 'var(--text-heading)' }}>
                  Metabolic & Endocrine Tip
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {currentPhase.pcosCare}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
