import React, { useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  History, 
  BookOpen, 
  Bot, 
  Utensils, 
  Sliders, 
  CalendarCheck, 
  X, 
  ChevronRight, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout 
}) {
  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navGroups = [
    {
      groupTitle: 'Clinical Assessments',
      items: [
        {
          id: 'assessment',
          label: 'Risk Assessment',
          description: '13-biomarker ML screening',
          icon: Activity,
          color: '#E11D48',
          bg: '#FFF1F2',
          badge: 'AI Model'
        },
        {
          id: 'history',
          label: 'Assessment History',
          description: 'Track trends & clinical reports',
          icon: History,
          color: '#D94676',
          bg: '#FDF2F8',
          badge: 'Trends'
        },
        {
          id: 'simulator',
          label: 'Risk Simulator',
          description: 'Interactive "What-If" modeling',
          icon: Sliders,
          color: '#0284C7',
          bg: '#F0F9FF',
          badge: 'Interactive'
        }
      ]
    },
    {
      groupTitle: 'Wellness & Daily Care',
      items: [
        {
          id: 'ask-sakhi',
          label: 'Ask Sakhi AI',
          description: 'Clinical Q&A & reproductive guidance',
          icon: Bot,
          color: '#8B5CF6',
          bg: '#F5F3FF',
          badge: '24/7 AI'
        },
        {
          id: 'nutrition',
          label: 'Nutrition & Diet',
          description: 'Anti-inflammatory PCOS foods',
          icon: Utensils,
          color: '#059669',
          bg: '#ECFDF5',
          badge: 'Evidence'
        },
        {
          id: 'habits',
          label: 'Daily Habit Tracker',
          description: 'Inositol, spearmint & workout streaks',
          icon: CalendarCheck,
          color: '#D97706',
          bg: '#FFFBEB',
          badge: 'Streaks'
        },
        {
          id: 'learn',
          label: 'PCOS Knowledge Guide',
          description: 'Rotterdam criteria & diagnostics',
          icon: BookOpen,
          color: '#2563EB',
          bg: '#EFF6FF',
          badge: 'Guide'
        }
      ]
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Dimmed Backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside 
        className={`sidebar-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Main Navigation Menu"
        aria-hidden={!isOpen}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div 
            className="brand-logo" 
            onClick={() => handleNavClick('assessment')} 
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon-wrapper">
              <Heart size={20} fill="white" strokeWidth={0} />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">SakhiCare</span>
              <span className="sidebar-brand-tag">PCOS Health Companion</span>
            </div>
          </div>

          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close navigation sidebar"
            title="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-profile-card">
          {user ? (
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                <UserIcon size={18} />
              </div>
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">{user.email.split('@')[0]}</span>
                <span className="sidebar-user-status">
                  <span className="status-dot"></span>
                  Active Patient
                </span>
              </div>
              <button 
                className="sidebar-logout-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="sidebar-guest-card">
              <div className="guest-info">
                <span className="guest-title">Guest Screening Mode</span>
                <span className="guest-sub">Sign in to save and track your history</span>
              </div>
              <button 
                className="btn btn-primary sidebar-auth-btn"
                onClick={() => {
                  onOpenAuth('login');
                  onClose();
                }}
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-nav-content">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="sidebar-nav-group">
              <div className="sidebar-group-title">{group.groupTitle}</div>
              <ul className="sidebar-nav-list">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button 
                        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                      >
                        <div 
                          className="sidebar-item-icon" 
                          style={{ 
                            background: item.bg, 
                            color: item.color 
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="sidebar-item-text">
                          <div className="sidebar-item-row">
                            <span className="sidebar-item-label">{item.label}</span>
                            {item.badge && (
                              <span 
                                className="sidebar-item-badge"
                                style={{
                                  background: isActive ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                  color: isActive ? 'white' : 'var(--text-muted)'
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="sidebar-item-desc">{item.description}</span>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className="sidebar-item-arrow" 
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Clinical Tip Card */}
          <div className="sidebar-tip-card">
            <div className="sidebar-tip-header">
              <Lightbulb size={16} className="tip-icon" />
              <span>Daily Health Insight</span>
            </div>
            <p className="sidebar-tip-body">
              Consistent 40:1 Myo-Inositol combined with spearmint tea assists hormonal insulin regulation and restores ovulation rhythm.
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-disclaimer">
            <ShieldCheck size={14} />
            <span>Clinical screening & educational companion</span>
          </div>
          <div className="sidebar-version">SakhiCare v2.0 • HIPAA/Ethics Minded</div>
        </div>
      </aside>
    </>
  );
}
