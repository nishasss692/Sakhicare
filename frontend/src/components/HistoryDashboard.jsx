import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  History, 
  Calendar, 
  Activity, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  PlusCircle
} from 'lucide-react';

export default function HistoryDashboard({ isAuthenticated, onOpenAuth, onStartAssessment }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to load assessment history');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'white',
          padding: '48px 36px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--primary-light)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: 'var(--primary)'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Sign in to View Your History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '28px' }}>
            Track your PCOS risk scores over time, monitor symptom patterns, and securely access previous clinical reports.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => onOpenAuth('login')}>
              <span>Sign In / Register</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-section">
      <div className="container">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>Assessment History</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '2px' }}>
              Your logged screening records and risk progression.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onStartAssessment}>
            <PlusCircle size={18} />
            <span>New Assessment</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
            <Activity size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary)' }} />
            <p>Loading your clinical assessment history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            padding: '16px 20px', 
            background: 'var(--risk-high-bg)', 
            border: '1px solid var(--risk-high-border)', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--risk-high)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Empty History State */}
        {!isLoading && !error && history.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 24px',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)'
          }}>
            <History size={48} color="var(--text-subtle)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No Assessments Logged Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 24px auto' }}>
              Take your first AI screening to evaluate your risk factors and save your clinical profile.
            </p>
            <button className="btn btn-primary" onClick={onStartAssessment}>
              <PlusCircle size={18} />
              <span>Start First Screening</span>
            </button>
          </div>
        )}

        {/* History List */}
        {!isLoading && history.length > 0 && (
          <div>
            {history.map(item => {
              const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              let riskClass = 'low-risk';
              if (item.prediction === 'High Risk') riskClass = 'high-risk';
              else if (item.prediction === 'Moderate Risk') riskClass = 'mod-risk';

              return (
                <div key={item.id} className="history-card-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      background: riskClass === 'high-risk' ? 'var(--risk-high-bg)' : riskClass === 'mod-risk' ? 'var(--risk-mod-bg)' : 'var(--risk-low-bg)',
                      color: riskClass === 'high-risk' ? 'var(--risk-high)' : riskClass === 'mod-risk' ? 'var(--risk-mod)' : 'var(--risk-low)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}>
                      {item.risk_score}%
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`risk-badge ${riskClass}`} style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                          {item.prediction}
                        </span>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {dateStr}
                        </span>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginTop: '8px', 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)' 
                      }}>
                        <span>Age: <strong>{item.age} yrs</strong></span>
                        <span>BMI: <strong>{item.bmi}</strong></span>
                        <span>Cycle Length: <strong>{item.cycle_length} days</strong></span>
                        <span>Cycle: <strong>{item.cycle_ri === 4 ? 'Irregular' : 'Regular'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {item.recommendation && (
                    <div style={{ maxWidth: '380px', fontSize: '0.825rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--primary-light)', paddingLeft: '12px', display: 'none', lg: 'block' }}>
                      {item.recommendation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
