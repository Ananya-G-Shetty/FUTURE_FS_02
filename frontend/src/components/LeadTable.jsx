import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function LeadTable({
  leads,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  sortBy,
  setSortBy,
  onRefresh,
  onOpenDetails,
  onOpenEdit,
  onDeleteLead,
  onUpdateStatus
}) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setUpdatingId(leadId);
      await onUpdateStatus(leadId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'FollowUpDate', 'NotesCount', 'CreatedAt'];
    const rows = leads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.followUpDate || '').replace(/"/g, '""')}"`,
      l.notes?.length || 0,
      `"${(l.createdAt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusOptions = [
    { value: 'all', label: 'All Leads' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' }
  ];

  return (
    <div className="lead-table-container">
      {/* Search and Filters Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          {/* Live Search */}
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              id="input-lead-search"
              type="text"
              className="search-input"
              placeholder="Search leads by name, email, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Tabs Pills */}
          <div className="status-pills">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                id={`filter-status-${opt.value}`}
                className={`status-pill-btn ${statusFilter === opt.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Source Filter Dropdown */}
          <select
            id="select-source-filter"
            className="filter-select"
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
          >
            <option value="all">All Sources</option>
            <option value="Website Contact Form">Website Contact Form</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Organic Search">Organic Search</option>
            <option value="Campaign">Campaign</option>
            <option value="Other">Other</option>
          </select>

          {/* Sorting Dropdown */}
          <select
            id="select-sort-by"
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="followUp">Sort: Follow-Up Date</option>
          </select>
        </div>

        {/* Toolbar Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            id="btn-refresh-leads"
            className="btn-icon"
            onClick={onRefresh}
            title="Refresh Leads"
            aria-label="Refresh list"
          >
            <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
          </button>
          <button
            id="btn-export-csv"
            className="btn btn-secondary"
            onClick={exportCSV}
            title="Export filtered leads to CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead & Company</th>
              <th>Contact Details</th>
              <th>Source</th>
              <th>Status</th>
              <th>Follow-Up Date</th>
              <th>Notes / History</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={18} className="spin-anim" />
                    <span>Loading client leads...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <Search size={36} />
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>No client leads found</p>
                    <p style={{ fontSize: '0.85rem' }}>Try clearing filters or submit an inquiry through the Website Form Demo.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map(lead => {
                const leadId = lead.id || lead._id;
                const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date(new Date().toDateString());

                return (
                  <tr key={leadId} id={`lead-row-${leadId}`}>
                    {/* Lead & Company */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{lead.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          {lead.company || 'Direct Client'}
                        </span>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem' }}>
                        <a
                          href={`mailto:${lead.email}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-500)' }}
                          title={`Email ${lead.name}`}
                        >
                          <Mail size={13} />
                          <span>{lead.email}</span>
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}
                            title={`Call ${lead.name}`}
                          >
                            <Phone size={13} />
                            <span>{lead.phone}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Source */}
                    <td>
                      <span className="source-badge">
                        {lead.source}
                      </span>
                    </td>

                    {/* Status with Quick Update Dropdown */}
                    <td>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          id={`select-status-${leadId}`}
                          className={`status-badge status-${lead.status || 'new'}`}
                          style={{
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            paddingRight: '1.4rem',
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")",
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'calc(100% - 0.4rem) center'
                          }}
                          value={lead.status || 'new'}
                          disabled={updatingId === leadId}
                          onChange={e => handleStatusChange(leadId, e.target.value)}
                        >
                          <option value="new" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>NEW</option>
                          <option value="contacted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>CONTACTED</option>
                          <option value="converted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>CONVERTED</option>
                          <option value="lost" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>LOST</option>
                        </select>
                      </div>
                    </td>

                    {/* Follow-Up Date */}
                    <td>
                      {lead.followUpDate ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            color: isOverdue ? '#f43f5e' : 'var(--text-secondary)',
                            fontWeight: isOverdue ? 700 : 500
                          }}
                          title={isOverdue ? 'Follow-up is overdue!' : 'Scheduled follow-up'}
                        >
                          <Calendar size={13} />
                          <span>{lead.followUpDate}</span>
                          {isOverdue && <span style={{ fontSize: '0.7rem' }}>(Overdue)</span>}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None scheduled</span>
                      )}
                    </td>

                    {/* Notes Counter */}
                    <td>
                      <button
                        id={`btn-view-notes-${leadId}`}
                        className="btn-ghost"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => onOpenDetails(lead)}
                        title="View notes and activity history"
                      >
                        <MessageSquare size={14} />
                        <span>{lead.notes?.length || 0} notes</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          id={`btn-inspect-lead-${leadId}`}
                          className="btn-icon"
                          onClick={() => onOpenDetails(lead)}
                          title="Open full lead details"
                          aria-label="Inspect lead"
                        >
                          <ExternalLink size={15} />
                        </button>
                        <button
                          id={`btn-edit-lead-${leadId}`}
                          className="btn-icon"
                          onClick={() => onOpenEdit(lead)}
                          title="Edit Lead"
                          aria-label="Edit lead"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          id={`btn-delete-lead-${leadId}`}
                          className="btn-icon"
                          style={{ color: '#f43f5e' }}
                          onClick={() => onDeleteLead(leadId, lead.name)}
                          title="Delete Lead"
                          aria-label="Delete lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
