import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';

export default function LeadModal({ isOpen, onClose, onSave, lead = null }) {
  const isEditing = !!lead;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website Contact Form',
    status: 'new',
    followUpDate: '',
    initialNote: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'Website Contact Form',
        status: lead.status || 'new',
        followUpDate: lead.followUpDate || '',
        initialNote: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website Contact Form',
        status: 'new',
        followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        initialNote: ''
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Client name is required';
    if (!formData.email.trim()) {
      errs.email = 'Client email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(formData, lead ? (lead.id || lead._id) : null);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-glow)',
              color: 'var(--primary-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isEditing ? 'Edit Client Lead' : 'Create New Client Lead'}
            </h3>
          </div>
          <button id="btn-close-lead-modal" className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.12)',
                color: '#f43f5e',
                fontSize: '0.85rem'
              }}>
                {errors.form}
              </div>
            )}

            {/* Name & Email */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="lead-name">Client Name *</label>
                <input
                  id="lead-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rachel Adams"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span style={{ color: '#f43f5e', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-email">Email Address *</label>
                <input
                  id="lead-email"
                  type="email"
                  className="form-input"
                  placeholder="rachel@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span style={{ color: '#f43f5e', fontSize: '0.75rem' }}>{errors.email}</span>}
              </div>
            </div>

            {/* Phone & Company */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="lead-phone">Phone Number</label>
                <input
                  id="lead-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-company">Company / Organization</label>
                <input
                  id="lead-company"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            {/* Source & Status */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="lead-source">Lead Source</label>
                <select
                  id="lead-source"
                  className="form-select"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="Website Contact Form">Website Contact Form</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Organic Search">Organic Search</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-status">Initial Status</label>
                <select
                  id="lead-status"
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="new">NEW (Uncontacted)</option>
                  <option value="contacted">CONTACTED (In Progress)</option>
                  <option value="converted">CONVERTED (Won)</option>
                  <option value="lost">LOST</option>
                </select>
              </div>
            </div>

            {/* Follow-up Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="lead-followup">Target Follow-Up Date</label>
              <input
                id="lead-followup"
                type="date"
                className="form-input"
                value={formData.followUpDate}
                onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>

            {/* Initial Note (only on create) */}
            {!isEditing && (
              <div className="form-group">
                <label className="form-label" htmlFor="lead-note">Initial Activity Note</label>
                <textarea
                  id="lead-note"
                  rows="2"
                  className="form-textarea"
                  placeholder="Optional context about this lead..."
                  value={formData.initialNote}
                  onChange={e => setFormData({ ...formData, initialNote: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="btn-submit-lead-form"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
