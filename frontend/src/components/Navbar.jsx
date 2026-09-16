import React from 'react';
import { 
  Users, 
  Globe, 
  Plus, 
  Sun, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  onOpenAddModal, 
  onOpenLoginModal 
}) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="brand-logo">
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Zap size={20} fill="#ffffff" />
            </div>
            <span>LeadPulse</span>
            <span className="brand-badge">Mini CRM</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="nav-tabs">
          <button
            id="tab-crm"
            className={`nav-tab-btn ${activeTab === 'crm' ? 'active' : ''}`}
            onClick={() => setActiveTab('crm')}
          >
            <Users size={16} />
            <span>CRM Dashboard</span>
          </button>
          <button
            id="tab-website-form"
            className={`nav-tab-btn ${activeTab === 'website-form' ? 'active' : ''}`}
            onClick={() => setActiveTab('website-form')}
          >
            <Globe size={16} />
            <span>Website Form Demo</span>
          </button>
        </nav>

        {/* Actions & Profile */}
        <div className="nav-actions">
          {/* Theme Switcher */}
          <button
            id="btn-theme-toggle"
            className="btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add Lead CTA */}
          <button
            id="btn-add-lead"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>New Lead</span>
          </button>

          {/* Admin Auth Status */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <ShieldCheck size={14} />
                <span>{user.name}</span>
              </div>
              <button
                id="btn-logout"
                className="btn-icon"
                onClick={logout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="btn-login-modal"
              className="btn btn-secondary"
              onClick={onOpenLoginModal}
            >
              <LogIn size={15} />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
