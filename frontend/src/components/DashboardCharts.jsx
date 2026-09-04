import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, ShieldAlert, Heart, Calendar } from 'lucide-react';

export default function DashboardCharts({ history = [] }) {
  const [activeMetric, setActiveMetric] = useState('risk'); // 'risk' | 'bmi' | 'cycle'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Chronological order (oldest to newest) for plotting
  const sortedData = useMemo(() => {
    return [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [history]);

  if (!sortedData || sortedData.length === 0) return null;

  // Chart coordinate calculations
  const width = 760;
  const height = 240;
  const padding = { top: 24, right: 30, bottom: 36, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Metric definitions
  const metricConfig = {
    risk: {
      label: 'PCOS Risk Score',
      unit: '%',
      color: '#E11D48',
      fillGradient: 'url(#riskGradient)',
      getValue: (d) => Number(d.risk_score || 0),
      minY: 0,
      maxY: 100,
      thresholds: [
        { value: 60, label: 'High Risk (60%)', color: '#FDA4AF', strokeDash: '4 4' },
        { value: 35, label: 'Mod Risk (35%)', color: '#FCD34D', strokeDash: '4 4' }
      ]
    },
    bmi: {
      label: 'Body Mass Index (BMI)',
      unit: '',
      color: '#7C3AED',
      fillGradient: 'url(#bmiGradient)',
      getValue: (d) => Number(d.bmi || 22),
      minY: 15,
      maxY: 40,
      thresholds: [
        { value: 25, label: 'Overweight (25.0)', color: '#FCD34D', strokeDash: '4 4' },
        { value: 18.5, label: 'Normal Min (18.5)', color: '#6EE7B7', strokeDash: '4 4' }
      ]
    },
    cycle: {
      label: 'Cycle Length',
      unit: ' days',
      color: '#0D9488',
      fillGradient: 'url(#cycleGradient)',
      getValue: (d) => Number(d.cycle_length || 28),
      minY: 15,
      maxY: 60,
      thresholds: [
        { value: 35, label: 'Upper Normal (35d)', color: '#FCD34D', strokeDash: '4 4' },
        { value: 21, label: 'Lower Normal (21d)', color: '#6EE7B7', strokeDash: '4 4' }
      ]
    }
  };

  const currentConfig = metricConfig[activeMetric];

  // Derive points
  const points = sortedData.map((d, index) => {
    const val = currentConfig.getValue(d);
    const x = sortedData.length === 1 
      ? padding.left + chartWidth / 2 
      : padding.left + (index / (sortedData.length - 1)) * chartWidth;
    
    const clampedVal = Math.min(Math.max(val, currentConfig.minY), currentConfig.maxY);
    const normalizedY = (clampedVal - currentConfig.minY) / (currentConfig.maxY - currentConfig.minY);
    const y = padding.top + chartHeight - (normalizedY * chartHeight);

    return {
      x,
      y,
      rawVal: val,
      date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      item: d
    };
  });

  // Generate smooth SVG curve path
  const linePath = points.length === 1 
    ? `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`
    : points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = arr[i - 1];
        const cx = (prev.x + point.x) / 2;
        return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
      }, '');

  const areaPath = points.length === 1
    ? ''
    : `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Calculate metrics summary
  const values = points.map(p => p.rawVal);
  const latestVal = values[values.length - 1];
  const prevVal = values.length > 1 ? values[values.length - 2] : null;
  const delta = prevVal !== null ? (latestVal - prevVal).toFixed(1) : null;
  const avgVal = (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(1);
  const minVal = Math.min(...values).toFixed(1);
  const maxVal = Math.max(...values).toFixed(1);

  return (
    <div className="chart-card-container">
      <div className="chart-header-row">
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--primary)" />
            Health Progression & Clinical Trajectory
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Track how your biometric markers and PCOS probabilities change over time.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="chart-metric-pills">
          <button
            type="button"
            className={`metric-pill-btn ${activeMetric === 'risk' ? 'active risk' : ''}`}
            onClick={() => setActiveMetric('risk')}
          >
            Risk Score (%)
          </button>
          <button
            type="button"
            className={`metric-pill-btn ${activeMetric === 'bmi' ? 'active bmi' : ''}`}
            onClick={() => setActiveMetric('bmi')}
          >
            BMI Trajectory
          </button>
          <button
            type="button"
            className={`metric-pill-btn ${activeMetric === 'cycle' ? 'active cycle' : ''}`}
            onClick={() => setActiveMetric('cycle')}
          >
            Cycle Duration
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="svg-wrapper" style={{ position: 'relative', marginTop: '16px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="metric-svg-chart"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * pct;
            const valueLabel = Math.round(currentConfig.maxY - pct * (currentConfig.maxY - currentConfig.minY));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                >
                  {valueLabel}{currentConfig.unit}
                </text>
              </g>
            );
          })}

          {/* Reference Threshold Lines */}
          {currentConfig.thresholds.map((th, idx) => {
            if (th.value < currentConfig.minY || th.value > currentConfig.maxY) return null;
            const normY = (th.value - currentConfig.minY) / (currentConfig.maxY - currentConfig.minY);
            const lineY = padding.top + chartHeight - normY * chartHeight;
            return (
              <g key={`th-${idx}`}>
                <line
                  x1={padding.left}
                  y1={lineY}
                  x2={padding.left + chartWidth}
                  y2={lineY}
                  stroke={th.color}
                  strokeWidth="1.5"
                  strokeDasharray={th.strokeDash}
                />
                <text
                  x={padding.left + chartWidth}
                  y={lineY - 4}
                  textAnchor="end"
                  fontSize="9"
                  fill={th.color}
                  fontWeight="600"
                >
                  {th.label}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill={currentConfig.fillGradient}
              style={{ transition: 'all 0.4s ease' }}
            />
          )}

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke={currentConfig.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.4s ease' }}
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="chart-data-node">
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="white"
                stroke={currentConfig.color}
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Date label at bottom for first, last, and every few */}
              {(idx === 0 || idx === points.length - 1 || points.length <= 5) && (
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748B"
                  fontWeight="500"
                >
                  {p.date.split(',')[0]}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="chart-hover-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`
            }}
          >
            <div className="tooltip-date">
              <Calendar size={12} />
              <span>{hoveredPoint.date}</span>
            </div>
            <div className="tooltip-value" style={{ color: currentConfig.color }}>
              {hoveredPoint.rawVal}{currentConfig.unit}
            </div>
            <div className="tooltip-extra">
              {activeMetric === 'risk' && `Category: ${hoveredPoint.item.prediction}`}
              {activeMetric === 'bmi' && `Weight: ${hoveredPoint.item.weight} kg`}
              {activeMetric === 'cycle' && `Cycle: ${hoveredPoint.item.cycle_ri === 4 ? 'Irregular' : 'Regular'}`}
            </div>
          </div>
        )}
      </div>

      {/* Metric Summary Statistics Footer */}
      <div className="chart-summary-stats">
        <div className="stat-pill">
          <span className="stat-pill-label">Latest Recorded</span>
          <span className="stat-pill-val" style={{ color: currentConfig.color }}>
            {latestVal}{currentConfig.unit}
          </span>
        </div>

        {delta !== null && (
          <div className="stat-pill">
            <span className="stat-pill-label">Trend vs Previous</span>
            <span className={`stat-pill-delta ${Number(delta) < 0 ? 'good' : Number(delta) > 0 ? 'warning' : 'neutral'}`}>
              {Number(delta) > 0 ? `+${delta}` : delta}{currentConfig.unit}
              {Number(delta) < 0 ? <TrendingDown size={14} /> : Number(delta) > 0 ? <TrendingUp size={14} /> : <Minus size={14} />}
            </span>
          </div>
        )}

        <div className="stat-pill">
          <span className="stat-pill-label">Average</span>
          <span className="stat-pill-val">{avgVal}{currentConfig.unit}</span>
        </div>

        <div className="stat-pill">
          <span className="stat-pill-label">Range (Min - Max)</span>
          <span className="stat-pill-val">{minVal} – {maxVal}{currentConfig.unit}</span>
        </div>
      </div>
    </div>
  );
}
