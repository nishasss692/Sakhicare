import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Award, 
  Sparkles, 
  Calendar, 
  Coffee, 
  Pill, 
  Dumbbell, 
  Droplet, 
  Moon, 
  HeartHandshake, 
  Smile,
  RotateCcw
} from 'lucide-react';

const HABITS_LIST = [
  {
    id: 'inositol',
    title: 'Myo-Inositol & D-Chiro (40:1)',
    category: 'Supplement',
    benefit: 'Restores insulin sensitivity & ovarian signaling',
    icon: Pill,
    color: '#D94676'
  },
  {
    id: 'spearmint',
    title: 'Organic Spearmint Tea (1-2 cups)',
    category: 'Herbal Therapy',
    benefit: 'Naturally lowers circulating free testosterone & hirsutism',
    icon: Coffee,
    color: '#0D9488'
  },
  {
    id: 'workout',
    title: '25-min Low-Cortisol Strength/Walk',
    category: 'Movement',
    benefit: 'Activates muscular GLUT4 glucose transporters without adrenal spikes',
    icon: Dumbbell,
    color: '#8B5CF6'
  },
  {
    id: 'hydration',
    title: '2.5 Liters Hydration & Minerals',
    category: 'Metabolic',
    benefit: 'Supports liver estrogen detoxification and lymphatic flow',
    icon: Droplet,
    color: '#0284C7'
  },
  {
    id: 'sleep',
    title: '8 Hours Quality Sleep & Melatonin',
    category: 'Recovery',
    benefit: 'Critical for morning cortisol rhythm and fasting blood glucose',
    icon: Moon,
    color: '#6366F1'
  },
  {
    id: 'magnesium',
    title: 'Magnesium Glycinate / Zinc',
    category: 'Nutrients',
    benefit: 'Calms nervous system and inhibits 5-alpha reductase enzyme',
    icon: HeartHandshake,
    color: '#EC4899'
  }
];

export default function HabitTrackerWidget() {
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [habitsState, setHabitsState] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhicare_habits_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streakCount, setStreakCount] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhicare_habit_streak');
      return saved ? parseInt(saved, 10) : 5; // Default encouraging streak
    } catch {
      return 5;
    }
  });

  // Current day checklist
  const todayCompleted = habitsState[todayKey] || [];

  // Toggle habit
  const handleToggle = (id) => {
    const isCurrentlyChecked = todayCompleted.includes(id);
    const updated = isCurrentlyChecked 
      ? todayCompleted.filter(h => h !== id)
      : [...todayCompleted, id];

    const newState = {
      ...habitsState,
      [todayKey]: updated
    };

    setHabitsState(newState);
    try {
      localStorage.setItem('sakhicare_habits_tracker', JSON.stringify(newState));
    } catch (e) {
      console.error(e);
    }

    // Trigger confetti if all habits completed
    if (!isCurrentlyChecked && updated.length === HABITS_LIST.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      localStorage.setItem('sakhicare_habit_streak', String(newStreak));
    }
  };

  const completionPct = Math.round((todayCompleted.length / HABITS_LIST.length) * 100);

  return (
    <div className="habit-tracker-container">
      {/* Header Banner */}
      <div className="habit-top-header">
        <div className="habit-title-wrap">
          <div className="habit-icon-badge">
            <Flame size={24} color="#F97316" />
          </div>
          <div>
            <h3 className="widget-title">Daily PCOS Wellness & Habit Tracker</h3>
            <p className="widget-subtitle">
              Small consistent micro-actions build hormonal homeostasis. Check off your daily anti-inflammatory rituals.
            </p>
          </div>
        </div>

        {/* Gamified Streak Badge */}
        <div className="streak-badge-card">
          <div className="streak-icon-wrap">
            <Flame size={22} className="streak-flame-anim" color="#F97316" fill="#F97316" />
          </div>
          <div className="streak-info">
            <span className="streak-number">{streakCount} Day Streak</span>
            <span className="streak-subtitle">Consistency Champion</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Milestone Status */}
      <div className="habit-progress-summary">
        <div className="progress-top-info">
          <span className="progress-status-text">
            Today's Completion: <strong>{todayCompleted.length} of {HABITS_LIST.length} completed ({completionPct}%)</strong>
          </span>
          <span className="progress-milestone-text">
            {completionPct === 100 ? '🎉 All rituals complete! Outstanding work.' : `${HABITS_LIST.length - todayCompleted.length} remaining today`}
          </span>
        </div>
        <div className="habit-progress-track">
          <div 
            className="habit-progress-fill" 
            style={{ 
              width: `${completionPct}%`,
              background: completionPct === 100 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #D94676, #EC4899)'
            }} 
          />
        </div>
      </div>

      {/* Habits Checklist Grid */}
      <div className="habits-cards-grid">
        {HABITS_LIST.map(habit => {
          const isDone = todayCompleted.includes(habit.id);
          const IconComponent = habit.icon;

          return (
            <div 
              key={habit.id} 
              className={`habit-action-card ${isDone ? 'completed' : ''}`}
              onClick={() => handleToggle(habit.id)}
            >
              <div className="habit-card-left">
                <div 
                  className="habit-type-icon" 
                  style={{ 
                    backgroundColor: `${habit.color}15`, 
                    color: habit.color 
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <div className="habit-details">
                  <div className="habit-cat-pill" style={{ color: habit.color }}>
                    {habit.category}
                  </div>
                  <h4 className="habit-name">{habit.title}</h4>
                  <p className="habit-benefit">{habit.benefit}</p>
                </div>
              </div>

              <button 
                type="button" 
                className={`habit-check-btn ${isDone ? 'checked' : ''}`}
                aria-label={`Mark ${habit.title} as ${isDone ? 'incomplete' : 'complete'}`}
              >
                {isDone ? <CheckCircle2 size={24} color="#10B981" fill="#D1FAE5" /> : <Circle size={24} color="#CBD5E1" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Gamified Milestones Row */}
      <div className="habit-milestones-row">
        <h4 className="milestones-heading">
          <Award size={18} color="var(--primary)" />
          Hormone Consistency Milestones
        </h4>
        <div className="milestones-badges-list">
          <div className={`milestone-pill ${streakCount >= 3 ? 'unlocked' : 'locked'}`}>
            <span className="milestone-badge-icon">🌱</span>
            <div className="milestone-text">
              <strong>3-Day Kickstart</strong>
              <small>{streakCount >= 3 ? 'Unlocked ✓' : 'In Progress'}</small>
            </div>
          </div>

          <div className={`milestone-pill ${streakCount >= 7 ? 'unlocked' : 'locked'}`}>
            <span className="milestone-badge-icon">🔥</span>
            <div className="milestone-text">
              <strong>7-Day Insulin Reset</strong>
              <small>{streakCount >= 7 ? 'Unlocked ✓' : 'In Progress'}</small>
            </div>
          </div>

          <div className={`milestone-pill ${streakCount >= 14 ? 'unlocked' : 'locked'}`}>
            <span className="milestone-badge-icon">🌸</span>
            <div className="milestone-text">
              <strong>14-Day Luteal Support</strong>
              <small>{streakCount >= 14 ? 'Unlocked ✓' : `${14 - streakCount} days away`}</small>
            </div>
          </div>

          <div className={`milestone-pill ${streakCount >= 30 ? 'unlocked' : 'locked'}`}>
            <span className="milestone-badge-icon">👑</span>
            <div className="milestone-text">
              <strong>30-Day PCOS Master</strong>
              <small>{streakCount >= 30 ? 'Unlocked ✓' : `${30 - streakCount} days away`}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
