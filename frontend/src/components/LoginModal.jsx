import React, { useState } from 'react';
import { X, Lock, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail('admin@crm.com');
    setPassword('admin123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Admin Portal Sign In</h3>
          </div>
          <button id="btn-close-login-modal" className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#f43f5e',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            {/* Quick Demo Fill CTA */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px dashed var(--primary-500)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Demo Admin: <strong>admin@crm.com</strong></span>
              </div>
              <button
                id="btn-fill-demo-admin"
                type="button"
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                onClick={handleFillDemo}
              >
                <Sparkles size={12} />
                <span>Auto-Fill</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Admin Email</label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="admin@crm.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="btn-submit-login"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <KeyRound size={15} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
