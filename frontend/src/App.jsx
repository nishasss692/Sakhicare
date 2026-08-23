import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AssessmentWizard from './components/AssessmentWizard';
import ResultCard from './components/ResultCard';
import HistoryDashboard from './components/HistoryDashboard';
import LearnPCOS from './components/LearnPCOS';
import AuthModal from './components/AuthModal';
import { api } from './services/api';
import { Heart, Shield, Info, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const [pendingPayload, setPendingPayload] = useState(null);

  // Check auth state and backend health on load
  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    api.healthCheck().then(isHealthy => {
      setBackendOnline(isHealthy);
    });
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    // If user submitted an assessment while logged out, continue immediately
    if (pendingPayload) {
      handleAssessmentSubmit(pendingPayload);
      setPendingPayload(null);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    if (activeTab === 'history') {
      setActiveTab('assessment');
    }
  };

  const handleAssessmentSubmit = async (payload) => {
    setIsLoading(true);
    try {
      const result = await api.predictRisk(payload);
      setAssessmentResult(result);
    } catch (err) {
      alert(err.message || 'Error processing assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setAssessmentResult(null);
    setActiveTab('assessment');
  };

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'assessment') setAssessmentResult(null);
        }}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Backend Status Warning if Offline */}
      {!backendOnline && (
        <div style={{
          background: 'var(--risk-mod-bg)',
          borderBottom: '1px solid var(--risk-mod-border)',
          color: '#92400E',
          padding: '10px 24px',
          textAlign: 'center',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} color="#D97706" />
          <span>
            Backend API is starting or unreachable. Please ensure <code>uvicorn app.main:app --port 8000</code> is running.
          </span>
        </div>
      )}

      {/* Main Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'assessment' && (
          <>
            {!assessmentResult ? (
              <>
                <Hero onStartAssessment={() => {
                  const element = document.querySelector('.card-wizard');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} />
                <AssessmentWizard 
                  onSubmit={handleAssessmentSubmit}
                  isLoading={isLoading}
                  isAuthenticated={!!user}
                  onAuthRequired={() => {
                    handleOpenAuth('register');
                  }}
                />
              </>
            ) : (
              <ResultCard 
                result={assessmentResult}
                onRetake={handleRetake}
                onGoToHistory={() => setActiveTab('history')}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <HistoryDashboard 
            isAuthenticated={!!user}
            onOpenAuth={handleOpenAuth}
            onStartAssessment={() => {
              setAssessmentResult(null);
              setActiveTab('assessment');
            }}
          />
        )}

        {activeTab === 'learn' && (
          <LearnPCOS 
            onStartAssessment={() => {
              setAssessmentResult(null);
              setActiveTab('assessment');
            }}
          />
        )}
      </main>

      {/* Medical Disclaimer & Footer */}
      <footer style={{ 
        background: 'white', 
        borderTop: '1px solid var(--border-subtle)', 
        padding: '36px 0 28px 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>
              <Heart size={20} fill="var(--primary)" />
              <span>SakhiCare</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              AI-Powered Non-Invasive PCOS Risk Screening & Reproductive Health Companion
            </p>
          </div>

          <div style={{ 
            padding: '14px 18px', 
            background: '#F9FAFB', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-medium)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5'
          }}>
            <strong>Medical Disclaimer:</strong> SakhiCare is an AI screening and educational tool designed to assist with early risk awareness. It does not provide medical diagnoses or replace professional medical consultation, diagnostic pelvic ultrasound, or certified clinical laboratory testing.
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} SakhiCare. Built with React, Vite & FastAPI Random Forest ML Classifier.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
