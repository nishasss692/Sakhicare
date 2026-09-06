import React from 'react';
import { Heart } from 'lucide-react';

export default function Navbar({ 
  setActiveTab, 
  onToggleSidebar,
  isSidebarOpen 
}) {
  return (
    <div className="corner-nav-launcher" aria-label="Main Navigation">
      {/* Three Bars Hamburger Menu Button */}
      <button 
        type="button"
        className={`hamburger-btn ${isSidebarOpen ? 'active' : ''}`}
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        title="Open navigation menu"
      >
        <span className="hamburger-bar bar-1"></span>
        <span className="hamburger-bar bar-2"></span>
        <span className="hamburger-bar bar-3"></span>
      </button>

      {/* SakhiCare Brand beside the three bars */}
      <div 
        className="corner-nav-brand" 
        onClick={() => {
          if (setActiveTab) setActiveTab('assessment');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (setActiveTab) setActiveTab('assessment');
          }
        }}
        role="button"
        tabIndex={0}
        title="SakhiCare Home"
      >
        <div className="corner-brand-icon">
          <Heart size={18} fill="white" strokeWidth={0} />
        </div>
        <span className="corner-brand-text">SakhiCare</span>
      </div>
    </div>
  );
}
