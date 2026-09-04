import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Droplet, 
  HeartPulse, 
  Smile, 
  Activity, 
  Check, 
  Plus, 
  Info,
  Clock
} from 'lucide-react';

const SYMPTOM_OPTIONS = {
  flow: ['None', 'Spotting', 'Light', 'Medium', 'Heavy'],
  cramps: ['None', 'Mild', 'Moderate', 'Severe'],
  acne: ['Clear', 'Mild Breakout', 'Moderate Breakout', 'Cystic Flare'],
  bloating: ['None', 'Slight', 'Noticeable', 'Severe'],
  mood: ['Calm & Happy', 'Energetic', 'Anxious', 'Irritable', 'Low/Fatigued'],
  energy: ['High', 'Moderate', 'Sluggish', 'Exhausted']
};

export default function CycleCalendarWidget({ userCycleLength = 28, lastPeriodDate = null }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [symptomsData, setSymptomsData] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhicare_cycle_symptoms');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sakhicare_cycle_symptoms', JSON.stringify(symptomsData));
    } catch (err) {
      console.error('Failed to save symptoms:', err);
    }
  }, [symptomsData]);

  // Compute month layout
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const selectedDateKey = useMemo(() => {
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  }, [selectedDate]);

  const activeSymptoms = symptomsData[selectedDateKey] || {
    flow: 'None',
    cramps: 'None',
    acne: 'Clear',
    bloating: 'None',
    mood: 'Calm & Happy',
    energy: 'Moderate',
    notes: ''
  };

  const handleSymptomChange = (field, value) => {
    setSymptomsData(prev => ({
      ...prev,
      [selectedDateKey]: {
        ...(prev[selectedDateKey] || {
          flow: 'None',
          cramps: 'None',
          acne: 'Clear',
          bloating: 'None',
          mood: 'Calm & Happy',
          energy: 'Moderate',
          notes: ''
        }),
        [field]: value
      }
    }));
  };

  // Approximate cycle phases calculation
  const baselinePeriod = useMemo(() => {
    if (lastPeriodDate) return new Date(lastPeriodDate);
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d;
  }, [lastPeriodDate]);

  const getDayPhase = (dayNum) => {
    const dateObj = new Date(year, month, dayNum);
    const diffTime = dateObj.getTime() - baselinePeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % userCycleLength) + userCycleLength) % userCycleLength + 1;

    if (cycleDay >= 1 && cycleDay <= 5) {
      return { phase: 'Menstrual', color: '#F43F5E', label: 'Menstrual (Period)' };
    } else if (cycleDay >= 6 && cycleDay <= 11) {
      return { phase: 'Follicular', color: '#8B5CF6', label: 'Follicular Phase' };
    } else if (cycleDay >= 12 && cycleDay <= 16) {
      return { phase: 'Ovulatory', color: '#0D9488', label: 'Fertile / Ovulation Window' };
    } else {
      return { phase: 'Luteal', color: '#D94676', label: 'Luteal Phase' };
    }
  };

  const selectedDayPhase = useMemo(() => {
    const diffTime = selectedDate.getTime() - baselinePeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % userCycleLength) + userCycleLength) % userCycleLength + 1;
    const daysUntilNext = userCycleLength - cycleDay;

    let info = getDayPhase(selectedDate.getDate());
    return {
      ...info,
      cycleDay,
      daysUntilNext: daysUntilNext > 0 ? daysUntilNext : userCycleLength
    };
  }, [selectedDate, baselinePeriod, userCycleLength]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day) => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
  };

  const isSelected = (day) => {
    return selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
  };

  const hasSymptomsLogged = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = symptomsData[key];
    if (!entry) return false;
    return entry.flow !== 'None' || entry.cramps !== 'None' || entry.acne !== 'Clear' || entry.bloating !== 'None' || (entry.notes && entry.notes.trim().length > 0);
  };

  return (
    <div className="cycle-calendar-container">
      {/* Header Summary Banner */}
      <div className="calendar-top-header">
        <div className="calendar-title-wrap">
          <div className="calendar-icon-badge">
            <CalendarIcon size={24} color="var(--primary)" />
          </div>
          <div>
            <h3 className="widget-title">Cycle & Ovulation Calendar</h3>
            <p className="widget-subtitle">
              Forecast your hormonal windows, log daily symptoms, and correlate flare-ups with your cycle.
            </p>
          </div>
        </div>

        <div className="calendar-stats-pills">
          <div className="calendar-pill">
            <span className="pill-label">Est. Cycle Day</span>
            <span className="pill-value" style={{ color: selectedDayPhase.color }}>
              Day {selectedDayPhase.cycleDay}
            </span>
          </div>
          <div className="calendar-pill">
            <span className="pill-label">Phase</span>
            <span className="pill-value" style={{ color: selectedDayPhase.color }}>
              {selectedDayPhase.phase}
            </span>
          </div>
          <div className="calendar-pill">
            <span className="pill-label">Next Period</span>
            <span className="pill-value" style={{ color: 'var(--text-main)' }}>
              In ~{selectedDayPhase.daysUntilNext} days
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Symptom Check-in on Right */}
      <div className="calendar-body-grid">
        {/* Left: Monthly Calendar */}
        <div className="calendar-card">
          <div className="calendar-nav-bar">
            <button className="cal-nav-btn" onClick={prevMonth} title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <h4 className="cal-month-title">
              {monthNames[month]} {year}
            </h4>
            <button className="cal-nav-btn" onClick={nextMonth} title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of week */}
          <div className="cal-weekdays-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="cal-weekday-cell">{d}</div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="cal-days-grid">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="cal-day-cell empty" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const phaseInfo = getDayPhase(dayNum);
              const selected = isSelected(dayNum);
              const today = isToday(dayNum);
              const hasLog = hasSymptomsLogged(dayNum);

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  className={`cal-day-cell ${selected ? 'selected' : ''} ${today ? 'today' : ''}`}
                  onClick={() => setSelectedDate(new Date(year, month, dayNum))}
                  style={{
                    borderColor: selected ? 'var(--primary)' : 'transparent',
                    background: selected ? 'rgba(217, 70, 118, 0.08)' : today ? 'rgba(13, 148, 136, 0.05)' : undefined
                  }}
                >
                  <span className="day-number">{dayNum}</span>
                  <div 
                    className="day-phase-dot" 
                    style={{ backgroundColor: phaseInfo.color }} 
                    title={phaseInfo.label}
                  />
                  {hasLog && <span className="day-log-indicator" title="Symptoms logged" />}
                </button>
              );
            })}
          </div>

          {/* Phase Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#F43F5E' }} />
              <span>Menstrual (1-5d)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#8B5CF6' }} />
              <span>Follicular (6-11d)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#0D9488' }} />
              <span>Fertile / Ovulation (12-16d)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#D94676' }} />
              <span>Luteal (17-28+d)</span>
            </div>
          </div>
        </div>

        {/* Right: Daily Symptom & Biomarker Logger */}
        <div className="symptom-logger-card">
          <div className="logger-header">
            <div>
              <span className="logger-date-badge">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <h4 className="logger-title">
                Day {selectedDayPhase.cycleDay} • {selectedDayPhase.label}
              </h4>
            </div>
            <div className="logger-phase-pill" style={{ borderColor: selectedDayPhase.color, color: selectedDayPhase.color }}>
              <Droplet size={14} />
              <span>{selectedDayPhase.phase}</span>
            </div>
          </div>

          {/* Quick Symptom Selectors */}
          <div className="symptom-selectors-grid">
            {/* Flow */}
            <div className="symptom-input-group">
              <label className="input-label">🩸 Menstrual Flow</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.flow.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.flow === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('flow', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Cramps */}
            <div className="symptom-input-group">
              <label className="input-label">⚡ Pelvic Cramps</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.cramps.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.cramps === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('cramps', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Acne */}
            <div className="symptom-input-group">
              <label className="input-label">✨ Skin & Acne</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.acne.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.acne === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('acne', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bloating */}
            <div className="symptom-input-group">
              <label className="input-label">🎈 Abdominal Bloating</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.bloating.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.bloating === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('bloating', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="symptom-input-group">
              <label className="input-label">🧠 Mood State</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.mood.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.mood === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('mood', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="symptom-input-group">
              <label className="input-label">⚡ Energy Level</label>
              <div className="pill-options-wrap">
                {SYMPTOM_OPTIONS.energy.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`symptom-option-btn ${activeSymptoms.energy === opt ? 'active' : ''}`}
                    onClick={() => handleSymptomChange('energy', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="symptom-input-group" style={{ marginTop: '14px' }}>
            <label className="input-label">📝 Daily Wellness Notes & Observations</label>
            <input
              type="text"
              className="symptom-notes-input"
              placeholder="e.g., Felt sluggish after lunch, spearmint tea helped with digestion..."
              value={activeSymptoms.notes || ''}
              onChange={(e) => handleSymptomChange('notes', e.target.value)}
            />
          </div>

          <div className="logger-footer-tip">
            <Sparkles size={16} color="var(--primary)" />
            <span>
              Auto-saved locally. Regular daily check-ins reveal symptom patterns for your gynecologist.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
