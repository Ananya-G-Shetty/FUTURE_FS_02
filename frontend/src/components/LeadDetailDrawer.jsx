import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Send, 
  Trash2, 
  User, 
  Building2, 
  Tag, 
  CheckCircle2, 
  MessageSquarePlus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeadDetailDrawer({ 
  lead, 
  isOpen, 
  onClose, 
  onAddNote, 
  onDeleteNote,
  onUpdateFollowUpDate,
  onUpdateStatus
}) {
  if (!isOpen || !lead) return null;

  const { user } = useAuth();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [followUpInput, setFollowUpInput] = useState(lead.followUpDate || '');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [savingDate, setSavingDate] = useState(false);

  const leadId = lead.id || lead._id;

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      setSubmittingNote(true);
      await onAddNote(leadId, {
        content: newNoteContent.trim(),
        author: user?.name || 'Admin',
        followUpDate: followUpInput
      });
      setNewNoteContent('');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleSaveDate = async () => {
    try {
      setSavingDate(true);
      await onUpdateFollowUpDate(leadId, followUpInput);
    } finally {
      setSavingDate(false);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Client Lead Details
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.1rem' }}>{lead.name}</h2>
          </div>
          <button 
            id="btn-close-drawer"
            className="btn-icon" 
            onClick={onClose} 
            title="Close Drawer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Quick Info Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Building2 size={16} />
                  <span>{lead.company || 'Direct Consumer / Not Specified'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  <Tag size={14} />
                  <span>Source: {lead.source}</span>
                </div>
              </div>

              {/* Status Switcher in Drawer */}
              <select
                className={`status-badge status-${lead.status || 'new'}`}
                style={{ cursor: 'pointer', outline: 'none' }}
                value={lead.status || 'new'}
                onChange={e => onUpdateStatus(leadId, e.target.value)}
              >
                <option value="new" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>NEW</option>
                <option value="contacted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>CONTACTED</option>
                <option value="converted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>CONVERTED</option>
                <option value="lost" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>LOST</option>
              </select>
            </div>

            {/* Contact Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <a
                href={`mailto:${lead.email}`}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              >
                <Mail size={14} />
                <span>Send Email</span>
              </a>
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                >
                  <Phone size={14} />
                  <span>Call Phone</span>
                </a>
              ) : (
                <button
                  disabled
                  className="btn btn-secondary"
                  style={{ opacity: 0.5, fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                >
                  <Phone size={14} />
                  <span>No Phone</span>
                </button>
              )}
            </div>
          </div>

          {/* Follow-up Scheduler Section */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <Calendar size={16} color="var(--primary-500)" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Follow-Up Schedule</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                id="input-drawer-followup"
                type="date"
                className="form-input"
                style={{ flex: 1 }}
                value={followUpInput}
                onChange={e => setFollowUpInput(e.target.value)}
              />
              <button
                id="btn-save-followup"
                className="btn btn-primary"
                onClick={handleSaveDate}
                disabled={savingDate}
              >
                {savingDate ? 'Saving...' : 'Set Date'}
              </button>
            </div>
          </div>

          {/* Inquiry Message (if from website form) */}
          {lead.message && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                Initial Website Inquiry
              </span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                "{lead.message}"
              </p>
            </div>
          )}

          {/* Notes & Follow-ups Timeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={16} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Activity & Notes Log</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {lead.notes?.length || 0} entries
              </span>
            </div>

            {/* Add Note Box */}
            <form onSubmit={handleCreateNote} style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <textarea
                  id="textarea-new-note"
                  rows="3"
                  className="form-textarea"
                  placeholder="Type follow-up notes, call logs, or meeting summaries..."
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  id="btn-submit-note"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingNote || !newNoteContent.trim()}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                >
                  <Send size={14} />
                  <span>{submittingNote ? 'Saving...' : 'Log Note'}</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="timeline">
              {(!lead.notes || lead.notes.length === 0) ? (
                <div style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No follow-up notes recorded yet. Add the first note above!
                </div>
              ) : (
                [...lead.notes].reverse().map(note => {
                  const noteId = note.id || note._id;
                  const dateStr = note.createdAt 
                    ? new Date(note.createdAt).toLocaleString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) 
                    : 'Just now';

                  return (
                    <div key={noteId} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-card">
                        <div className="timeline-meta">
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {note.author || 'Admin'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span>{dateStr}</span>
                            <button
                              id={`btn-delete-note-${noteId}`}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: '2px'
                              }}
                              onClick={() => onDeleteNote(leadId, noteId)}
                              title="Delete note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                          {note.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
