import React from 'react';
import { Heart, Activity, History, BookOpen, LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout,
  onToggleSidebar,
  isSidebarOpen 
}) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand & Hamburger Section */}
        <div className="nav-brand-section">
          {/* Three Bars Hamburger Button to access sidebar */}
          <button 
            className={`hamburger-btn ${isSidebarOpen ? 'active' : ''}`}
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            title="Access navigation sidebar"
          >
            <span className="hamburger-bar bar-1"></span>
            <span className="hamburger-bar bar-2"></span>
            <span className="hamburger-bar bar-3"></span>
          </button>

          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setActiveTab('assessment')}>
            <div className="brand-icon-wrapper">
              <Heart size={22} fill="white" strokeWidth={0} />
            </div>
            <span>SakhiCare</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-btn ${activeTab === 'assessment' ? 'active' : ''}`}
                onClick={() => setActiveTab('assessment')}
              >
                <Activity size={18} />
                <span>Risk Assessment</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <History size={18} />
                <span>My History</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
                onClick={() => setActiveTab('learn')}
              >
                <BookOpen size={18} />
                <span>PCOS Guide</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'var(--primary-subtle)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                <UserIcon size={16} />
                <span>{user.email.split('@')[0]}</span>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={onLogout}
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => onOpenAuth('login')}>
              <LogIn size={18} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

