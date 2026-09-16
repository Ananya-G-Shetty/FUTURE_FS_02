import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Globe2, 
  ShieldCheck,
  Building,
  Mail,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

export default function ContactFormDemo({ onLeadSubmitted, onSwitchToCrm }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeSample, setShowCodeSample] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide at least your full name and work email.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitPublicContact({
        ...formData,
        source: 'Website Contact Form'
      });

      if (res.success) {
        setSubmittedLeadId(res.leadId);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        if (onLeadSubmitted) onLeadSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit form inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-landing">
      {/* Hero Header */}
      <div className="demo-header">
        <div className="demo-badge">
          <Globe2 size={14} />
          <span>Website Contact Form Lead Generator</span>
        </div>
        <h1 className="demo-title">
          Connect with Enterprise Sales
        </h1>
        <p className="demo-desc">
          This simulated landing page contact form demonstrates how external visitor submissions automatically generate and feed new leads into the LeadPulse Mini CRM in real-time.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="demo-card">
        {submittedLeadId ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Inquiry Sent Successfully!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 1.75rem' }}>
              Your inquiry was ingested by the backend API and a new lead was created with status <strong>"NEW"</strong>.
            </p>

            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--accent-cyan)',
              marginBottom: '2rem'
            }}>
              Ingested Lead ID: {submittedLeadId}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                id="btn-view-lead-in-crm"
                className="btn btn-primary"
                onClick={onSwitchToCrm}
              >
                <span>View Lead in CRM Dashboard</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSubmittedLeadId(null)}
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#f43f5e',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Name & Email */}
            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="public-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="public-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jonathan Vance"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="public-email">Work Email *</label>
                <input
                  id="public-email"
                  type="email"
                  className="form-input"
                  placeholder="jonathan@hypergrowth.co"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone & Company */}
            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="public-phone">Phone Number</label>
                <input
                  id="public-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 321-7890"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="public-company">Company Name</label>
                <input
                  id="public-company"
                  type="text"
                  className="form-input"
                  placeholder="HyperGrowth Technologies"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            {/* Inquiry Message */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="public-message">Inquiry / Requirements</label>
              <textarea
                id="public-message"
                rows="4"
                className="form-textarea"
                placeholder="Tell us about your team size, workflow requirements, or timeline..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Submit CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="var(--status-converted-dot)" />
                <span>Encrypted & routed to sales CRM</span>
              </div>

              <button
                id="btn-public-submit"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                <Send size={16} />
                <span>{loading ? 'Submitting...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Integration Code Snippet Box */}
      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <button
          className="btn-ghost"
          style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}
          onClick={() => setShowCodeSample(!showCodeSample)}
        >
          <Code size={16} />
          <span>{showCodeSample ? 'Hide' : 'Show'} Website Integration Code Snippet (REST API)</span>
        </button>

        {showCodeSample && (
          <div className="glass-card" style={{ marginTop: '1rem', padding: '1.25rem', textAlign: 'left', background: 'var(--bg-secondary)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Any external website contact form can route leads into this CRM via HTTP POST:
            </p>
            <pre style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--accent-cyan)',
              overflowX: 'auto'
            }}>
{`fetch('http://localhost:5000/api/public/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@client.com',
    phone: '+1 555 123 4567',
    company: 'Acme International',
    message: 'Interested in product consultation',
    source: 'Website Contact Form'
  })
})
.then(res => res.json())
.then(data => console.log('Lead created:', data.leadId));`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
