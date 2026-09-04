import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import DashboardCharts from './DashboardCharts';
import HormonePhaseWidget from './HormonePhaseWidget';
import AssessmentDetailModal from './AssessmentDetailModal';
import AssessmentComparisonModal from './AssessmentComparisonModal';
import PrintableDoctorReport from './PrintableDoctorReport';
import { 
  History, 
  Calendar, 
  Activity, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Scale,
  Printer,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  Flame,
  Award,
  HeartPulse,
  Trash2
} from 'lucide-react';

const SAMPLE_ASSESSMENTS = [
  {
    id: 901,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    age: 24,
    height: 162,
    weight: 74,
    bmi: 28.2,
    cycle_ri: 4,
    cycle_length: 42,
    weight_gain: 1,
    hair_growth: 1,
    skin_darkening: 1,
    hair_loss: 1,
    pimples: 1,
    fast_food: 1,
    reg_exercise: 0,
    risk_score: 78.5,
    prediction: 'High Risk',
    recommendation: 'Strong clinical indicators detected. Consulting a gynecologist for pelvic ultrasound and hormone panel is strongly recommended.'
  },
  {
    id: 902,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    age: 24,
    height: 162,
    weight: 71,
    bmi: 27.1,
    cycle_ri: 4,
    cycle_length: 38,
    weight_gain: 1,
    hair_growth: 1,
    skin_darkening: 1,
    hair_loss: 0,
    pimples: 1,
    fast_food: 0,
    reg_exercise: 1,
    risk_score: 58.2,
    prediction: 'Moderate Risk',
    recommendation: 'Encouraging response to lifestyle changes. Continued low-glycemic dietary adjustments and regular workouts will support insulin balance.'
  },
  {
    id: 903,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    age: 24,
    height: 162,
    weight: 67,
    bmi: 25.5,
    cycle_ri: 2,
    cycle_length: 33,
    weight_gain: 0,
    hair_growth: 0,
    skin_darkening: 1,
    hair_loss: 0,
    pimples: 0,
    fast_food: 0,
    reg_exercise: 1,
    risk_score: 38.0,
    prediction: 'Moderate Risk',
    recommendation: 'Cycle regularity restored. Most androgenic symptoms have receded. Maintain consistent strength training and sleep hygiene.'
  },
  {
    id: 904,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    age: 24,
    height: 162,
    weight: 64,
    bmi: 24.4,
    cycle_ri: 2,
    cycle_length: 30,
    weight_gain: 0,
    hair_growth: 0,
    skin_darkening: 0,
    hair_loss: 0,
    pimples: 0,
    fast_food: 0,
    reg_exercise: 1,
    risk_score: 22.4,
    prediction: 'Low Risk',
    recommendation: 'BMI in optimal healthy range. Non-invasive markers reflect low PCOS probability. Continue your nourishing routine.'
  }
];

export default function HistoryDashboard({ isAuthenticated, onOpenAuth, onStartAssessment }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSampleData, setUseSampleData] = useState(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'High Risk' | 'Moderate Risk' | 'Low Risk'
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST' | 'OLDEST' | 'RISK_HIGH' | 'RISK_LOW'

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForReport, setSelectedForReport] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setIsLoading(false);
      setUseSampleData(true); // Default to preview mode for guests
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistory(data);
      if (!data || data.length === 0) {
        setUseSampleData(true);
      } else {
        setUseSampleData(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assessment history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (useSampleData) {
      setHistory(prev => prev.filter(item => item.id !== id));
      return;
    }
    await api.deleteAssessment(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Effective data array based on real vs sample toggle
  const activeHistory = useMemo(() => {
    if (useSampleData) return SAMPLE_ASSESSMENTS;
    return history;
  }, [useSampleData, history]);

  // Executive KPI calculations
  const kpiData = useMemo(() => {
    if (!activeHistory || activeHistory.length === 0) return null;

    const sortedChronological = [...activeHistory].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const latest = sortedChronological[sortedChronological.length - 1];
    const previous = sortedChronological.length > 1 ? sortedChronological[sortedChronological.length - 2] : null;

    const riskDelta = previous ? (latest.risk_score - previous.risk_score).toFixed(1) : null;
    const avgCycle = Math.round(activeHistory.reduce((sum, h) => sum + Number(h.cycle_length || 28), 0) / activeHistory.length);
    const avgRisk = (activeHistory.reduce((sum, h) => sum + Number(h.risk_score || 0), 0) / activeHistory.length).toFixed(1);

    // Lifestyle Resilience score out of 100
    let lifestyleScore = 50;
    if (latest.reg_exercise === 1) lifestyleScore += 25;
    if (latest.fast_food === 0) lifestyleScore += 15;
    if (latest.bmi >= 18.5 && latest.bmi <= 24.9) lifestyleScore += 10;
    if (latest.cycle_ri === 2) lifestyleScore += 10;
    lifestyleScore = Math.min(100, lifestyleScore);

    return {
      latest,
      previous,
      riskDelta,
      avgCycle,
      avgRisk,
      lifestyleScore,
      totalAssessments: activeHistory.length
    };
  }, [activeHistory]);

  // Symptom Frequency calculation across screenings
  const symptomStats = useMemo(() => {
    if (!activeHistory || activeHistory.length === 0) return [];

    const total = activeHistory.length;
    const list = [
      { name: 'Irregular Menstrual Cycle', count: activeHistory.filter(h => h.cycle_ri === 4).length, color: '#E11D48' },
      { name: 'Hirsutism (Excess Hair)', count: activeHistory.filter(h => h.hair_growth === 1).length, color: '#F59E0B' },
      { name: 'Acanthosis Nigricans (Skin Darkening)', count: activeHistory.filter(h => h.skin_darkening === 1).length, color: '#8B5CF6' },
      { name: 'Persistent Acne & Breakouts', count: activeHistory.filter(h => h.pimples === 1).length, color: '#EC4899' },
      { name: 'Scalp Hair Loss / Thinning', count: activeHistory.filter(h => h.hair_loss === 1).length, color: '#3B82F6' },
      { name: 'Rapid Weight Gain', count: activeHistory.filter(h => h.weight_gain === 1).length, color: '#F97316' },
      { name: 'Sedentary Lifestyle (No Exercise)', count: activeHistory.filter(h => h.reg_exercise === 0).length, color: '#64748B' }
    ];

    return list.map(item => ({
      ...item,
      percentage: Math.round((item.count / total) * 100)
    }));
  }, [activeHistory]);

  // Filtered and sorted cards
  const filteredHistory = useMemo(() => {
    let result = [...activeHistory];

    // Filter by risk category
    if (riskFilter !== 'ALL') {
      result = result.filter(h => h.prediction === riskFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.prediction.toLowerCase().includes(q) ||
        String(h.risk_score).includes(q) ||
        String(h.bmi).includes(q) ||
        new Date(h.created_at).toLocaleDateString().toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'OLDEST') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'RISK_HIGH') return b.risk_score - a.risk_score;
      if (sortBy === 'RISK_LOW') return a.risk_score - b.risk_score;
      return 0;
    });

    return result;
  }, [activeHistory, riskFilter, searchQuery, sortBy]);

  return (
    <div className="history-section">
      <div className="container">
        {/* Sample Data Demo Banner if applicable */}
        {useSampleData && (
          <div className="sample-mode-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#D94676" />
              <div>
                <strong>Interactive Demo Mode:</strong> Viewing sample clinical progression data showing positive lifestyle response.
                {!isAuthenticated && ' Sign in to track and save your own real screenings.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {isAuthenticated && history.length > 0 && (
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'white' }}
                  onClick={() => setUseSampleData(false)}
                >
                  Switch to My Records ({history.length})
                </button>
              )}
              {!isAuthenticated && (
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => onOpenAuth('login')}
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Header & Quick Action Buttons */}
        <div className="dashboard-hero-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '2rem' }}>PCOS Clinical Health Dashboard</h2>
              {useSampleData && <span className="demo-badge">Sample Data</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '4px' }}>
              Longitudinal risk tracking, biometric progression, hormonal cycle syncing, and physician consultation export.
            </p>
          </div>

          <div className="dashboard-action-buttons">
            {activeHistory.length >= 2 && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowComparison(true)}
              >
                <Scale size={17} />
                <span>Compare Screenings</span>
              </button>
            )}

            {kpiData?.latest && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setSelectedForReport(kpiData.latest)}
              >
                <Printer size={17} />
                <span>Doctor Printout</span>
              </button>
            )}

            <button type="button" className="btn btn-primary" onClick={onStartAssessment}>
              <PlusCircle size={18} />
              <span>New Screening</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
            <Activity size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary)' }} />
            <p>Loading your clinical health dashboard...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="dashboard-error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && kpiData && (
          <>
            {/* Executive Health KPI Summary Matrix */}
            <div className="kpi-matrix-grid">
              {/* Card 1: Latest Risk Score & Trend */}
              <div className="kpi-metric-card">
                <div className="kpi-card-header">
                  <span className="kpi-card-title">Latest Risk Assessment</span>
                  <HeartPulse size={18} color="var(--primary)" />
                </div>
                <div className="kpi-main-stat">
                  <span className="kpi-stat-number" style={{
                    color: kpiData.latest.prediction === 'High Risk' ? 'var(--risk-high)' : kpiData.latest.prediction === 'Moderate Risk' ? 'var(--risk-mod)' : 'var(--risk-low)'
                  }}>
                    {kpiData.latest.risk_score}%
                  </span>
                  <span className={`risk-badge ${kpiData.latest.prediction === 'High Risk' ? 'high-risk' : kpiData.latest.prediction === 'Moderate Risk' ? 'mod-risk' : 'low-risk'}`}>
                    {kpiData.latest.prediction}
                  </span>
                </div>
                <div className="kpi-card-footer">
                  {kpiData.riskDelta !== null ? (
                    <span className={`trend-tag ${Number(kpiData.riskDelta) < 0 ? 'good' : Number(kpiData.riskDelta) > 0 ? 'alert' : 'neutral'}`}>
                      {Number(kpiData.riskDelta) < 0 ? <TrendingDown size={14} /> : Number(kpiData.riskDelta) > 0 ? <TrendingUp size={14} /> : <Minus size={14} />}
                      {Number(kpiData.riskDelta) > 0 ? `+${kpiData.riskDelta}%` : `${kpiData.riskDelta}%`} vs previous
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Baseline Screening</span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg: {kpiData.avgRisk}%</span>
                </div>
              </div>

              {/* Card 2: Menstrual Cycle Health */}
              <div className="kpi-metric-card">
                <div className="kpi-card-header">
                  <span className="kpi-card-title">Cycle Health & Duration</span>
                  <Calendar size={18} color="var(--accent-teal)" />
                </div>
                <div className="kpi-main-stat">
                  <span className="kpi-stat-number" style={{ color: 'var(--accent-teal)' }}>
                    {kpiData.avgCycle}
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>days</span>
                  </span>
                  <span className="kpi-status-tag" style={{
                    background: kpiData.latest.cycle_ri === 2 ? 'var(--risk-low-bg)' : 'var(--risk-high-bg)',
                    color: kpiData.latest.cycle_ri === 2 ? 'var(--risk-low)' : 'var(--risk-high)',
                    border: `1px solid ${kpiData.latest.cycle_ri === 2 ? 'var(--risk-low-border)' : 'var(--risk-high-border)'}`
                  }}>
                    {kpiData.latest.cycle_ri === 2 ? 'Regular Cycle' : 'Irregular Cycle'}
                  </span>
                </div>
                <div className="kpi-card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Latest Duration: <strong>{kpiData.latest.cycle_length} days</strong>
                  </span>
                  <span style={{ fontSize: '0.8rem', color: kpiData.latest.cycle_length >= 21 && kpiData.latest.cycle_length <= 35 ? 'var(--risk-low)' : 'var(--risk-mod)' }}>
                    {kpiData.latest.cycle_length >= 21 && kpiData.latest.cycle_length <= 35 ? 'Normal window (21-35d)' : 'Irregular duration'}
                  </span>
                </div>
              </div>

              {/* Card 3: BMI & Metabolic Metric */}
              <div className="kpi-metric-card">
                <div className="kpi-card-header">
                  <span className="kpi-card-title">Metabolic & BMI Tracker</span>
                  <Scale size={18} color="var(--secondary)" />
                </div>
                <div className="kpi-main-stat">
                  <span className="kpi-stat-number" style={{ color: 'var(--secondary)' }}>
                    {kpiData.latest.bmi}
                  </span>
                  <span className="kpi-status-tag" style={{
                    background: kpiData.latest.bmi < 25 ? 'var(--risk-low-bg)' : 'var(--risk-mod-bg)',
                    color: kpiData.latest.bmi < 25 ? 'var(--risk-low)' : 'var(--risk-mod)',
                    border: `1px solid ${kpiData.latest.bmi < 25 ? 'var(--risk-low-border)' : 'var(--risk-mod-border)'}`
                  }}>
                    {kpiData.latest.bmi < 18.5 ? 'Underweight' : kpiData.latest.bmi < 25 ? 'Normal BMI' : kpiData.latest.bmi < 30 ? 'Overweight' : 'Obese'}
                  </span>
                </div>
                <div className="kpi-card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Weight: <strong>{kpiData.latest.weight} kg</strong> (Height: {kpiData.latest.height} cm)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    Target: 18.5 – 24.9
                  </span>
                </div>
              </div>

              {/* Card 4: PCOS Lifestyle Resilience Score */}
              <div className="kpi-metric-card">
                <div className="kpi-card-header">
                  <span className="kpi-card-title">Lifestyle Resilience Index</span>
                  <Award size={18} color="#D94676" />
                </div>
                <div className="kpi-main-stat">
                  <span className="kpi-stat-number" style={{ color: '#C026D3' }}>
                    {kpiData.lifestyleScore}
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/100</span>
                  </span>
                  <span className="kpi-status-tag" style={{
                    background: kpiData.lifestyleScore >= 75 ? 'var(--risk-low-bg)' : 'var(--risk-mod-bg)',
                    color: kpiData.lifestyleScore >= 75 ? 'var(--risk-low)' : 'var(--risk-mod)'
                  }}>
                    {kpiData.lifestyleScore >= 80 ? 'Optimal Habits' : kpiData.lifestyleScore >= 60 ? 'Moderate Habits' : 'Needs Routine'}
                  </span>
                </div>
                <div className="kpi-card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Exercise: {kpiData.latest.reg_exercise === 1 ? 'Active ✓' : 'Inactive ✗'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Diet: {kpiData.latest.fast_food === 0 ? 'Clean ✓' : 'Fast Food ✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Progression Charts */}
            <div style={{ marginBottom: '32px' }}>
              <DashboardCharts history={activeHistory} />
            </div>

            {/* Symptom Frequency & Hormone Companion Row */}
            <div className="dashboard-split-grid">
              {/* Left Column: Symptom Driver Frequency Breakdown */}
              <div className="symptom-breakdown-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Flame size={20} color="var(--primary)" />
                      Aggregate Symptom Driver Profile
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '2px' }}>
                      Frequency of symptoms flagged across {kpiData.totalAssessments} logged screening{kpiData.totalAssessments > 1 ? 's' : ''}.
                    </p>
                  </div>
                </div>

                <div className="symptom-bars-list">
                  {symptomStats.map((sym, idx) => (
                    <div key={idx} className="symptom-bar-row">
                      <div className="symptom-bar-info">
                        <span className="symptom-name">{sym.name}</span>
                        <span className="symptom-pct">
                          {sym.percentage}% ({sym.count}/{kpiData.totalAssessments})
                        </span>
                      </div>
                      <div className="symptom-bar-track">
                        <div 
                          className="symptom-bar-fill" 
                          style={{ 
                            width: `${sym.percentage}%`,
                            background: sym.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Cycle & Hormonal Phase Companion */}
              <div>
                <HormonePhaseWidget userCycleLength={kpiData.latest.cycle_length} />
              </div>
            </div>

            {/* Search, Filter & History Records Section */}
            <div style={{ marginTop: '40px' }}>
              <div className="history-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={16} color="var(--text-subtle)" />
                  <input
                    type="text"
                    placeholder="Search screenings by score, BMI, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-field"
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>

                <div className="filter-controls-group">
                  {/* Risk Filter Buttons */}
                  <div className="filter-pills">
                    {['ALL', 'High Risk', 'Moderate Risk', 'Low Risk'].map(filterVal => (
                      <button
                        key={filterVal}
                        type="button"
                        className={`filter-pill-btn ${riskFilter === filterVal ? 'active' : ''}`}
                        onClick={() => setRiskFilter(filterVal)}
                      >
                        {filterVal === 'ALL' ? 'All Risks' : filterVal}
                      </button>
                    ))}
                  </div>

                  {/* Sort By Dropdown */}
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown"
                  >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="RISK_HIGH">Highest Risk First</option>
                    <option value="RISK_LOW">Lowest Risk First</option>
                  </select>
                </div>
              </div>

              {/* Screenings Cards List */}
              {filteredHistory.length === 0 ? (
                <div className="empty-results-box">
                  <p>No screening records matched your filters.</p>
                  <button 
                    className="btn btn-secondary" 
                    style={{ marginTop: '8px', padding: '6px 14px', fontSize: '0.85rem' }}
                    onClick={() => { setSearchQuery(''); setRiskFilter('ALL'); }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="history-cards-container">
                  {filteredHistory.map((item) => {
                    const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    let riskClass = 'low-risk';
                    if (item.prediction === 'High Risk') riskClass = 'high-risk';
                    else if (item.prediction === 'Moderate Risk') riskClass = 'mod-risk';

                    // Count active symptoms in this screening
                    const activeSymptomsCount = [
                      item.hair_growth, 
                      item.skin_darkening, 
                      item.pimples, 
                      item.hair_loss, 
                      item.weight_gain
                    ].filter(v => v === 1).length;

                    return (
                      <div key={item.id} className="history-card-item">
                        <div className="history-card-main-info">
                          <div className={`history-score-badge ${riskClass}`}>
                            {item.risk_score}%
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <span className={`risk-badge ${riskClass}`}>
                                {item.prediction}
                              </span>
                              <span className="history-date-text">
                                <Calendar size={14} />
                                {dateStr}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                                #{item.id}
                              </span>
                            </div>

                            <div className="history-tags-row">
                              <span>Age: <strong>{item.age} yrs</strong></span>
                              <span>BMI: <strong>{item.bmi}</strong></span>
                              <span>Cycle: <strong>{item.cycle_length}d ({item.cycle_ri === 4 ? 'Irregular' : 'Regular'})</strong></span>
                              <span>Active Markers: <strong>{activeSymptomsCount} flagged</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons on each Card */}
                        <div className="history-card-actions">
                          <button
                            type="button"
                            className="btn btn-secondary card-action-btn"
                            onClick={() => setSelectedDetail(item)}
                            title="Inspect full screening"
                          >
                            <Eye size={15} />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary card-action-btn"
                            onClick={() => setSelectedForReport(item)}
                            title="Print Doctor consultation summary"
                          >
                            <Printer size={15} />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State when no history and not in demo mode */}
        {!isLoading && !error && history.length === 0 && !useSampleData && (
          <div className="empty-history-full-card">
            <History size={48} color="var(--text-subtle)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Screening Records Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              Take your first AI screening or activate demo preview mode to see full progression analytics.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={onStartAssessment}>
                <PlusCircle size={18} />
                <span>Take First Screening</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setUseSampleData(true)}>
                <Sparkles size={18} />
                <span>Preview with Sample Data</span>
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedDetail && (
          <AssessmentDetailModal
            assessment={selectedDetail}
            onClose={() => setSelectedDetail(null)}
            onDelete={handleDeleteAssessment}
            onOpenReport={(item) => setSelectedForReport(item)}
          />
        )}

        {showComparison && (
          <AssessmentComparisonModal
            history={activeHistory}
            onClose={() => setShowComparison(false)}
          />
        )}

        {selectedForReport && (
          <PrintableDoctorReport
            assessment={selectedForReport}
            user={api.getCurrentUser()}
            onClose={() => setSelectedForReport(null)}
          />
        )}
      </div>
    </div>
  );
}
