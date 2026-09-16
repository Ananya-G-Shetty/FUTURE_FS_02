import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import LeadTable from './components/LeadTable';
import LeadDetailDrawer from './components/LeadDetailDrawer';
import LeadModal from './components/LeadModal';
import ContactFormDemo from './components/ContactFormDemo';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

export default function App() {
  // Theme management (default: dark)
  const [theme, setTheme] = useState(() => localStorage.getItem('leadpulse_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('leadpulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // View state: 'crm' | 'website-form'
  const [activeTab, setActiveTab] = useState('crm');

  // Leads & Stats state
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Data fetching
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getLeadStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getLeads({
        search,
        status: statusFilter,
        source: sourceFilter,
        sortBy
      });
      if (res.success) {
        setLeads(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, sortBy]);

  // Initial load and filter reaction
  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [fetchLeads, fetchStats]);

  // Refresh both
  const handleRefresh = () => {
    fetchLeads();
    fetchStats();
    addToast('Leads refreshed', 'success');
  };

  // Status update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await api.updateLeadStatus(leadId, newStatus);
      if (res.success) {
        addToast(`Lead status updated to ${newStatus.toUpperCase()}`);
        fetchLeads();
        fetchStats();
        if (selectedLead && (selectedLead.id === leadId || selectedLead._id === leadId)) {
          setSelectedLead(res.data);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Save lead (create or update)
  const handleSaveLead = async (formData, id) => {
    if (id) {
      const res = await api.updateLead(id, formData);
      if (res.success) {
        addToast('Lead details updated successfully');
        fetchLeads();
        fetchStats();
        if (selectedLead && (selectedLead.id === id || selectedLead._id === id)) {
          setSelectedLead(res.data);
        }
      }
    } else {
      const res = await api.createLead(formData);
      if (res.success) {
        addToast('New lead created successfully');
        fetchLeads();
        fetchStats();
      }
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId, name) => {
    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) return;

    try {
      const res = await api.deleteLead(leadId);
      if (res.success) {
        addToast(`Lead "${name}" deleted`);
        fetchLeads();
        fetchStats();
        if (selectedLead && (selectedLead.id === leadId || selectedLead._id === leadId)) {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete lead', 'error');
    }
  };

  // Add note to lead
  const handleAddNote = async (leadId, noteData) => {
    try {
      const res = await api.addLeadNote(leadId, noteData);
      if (res.success) {
        addToast('Note logged successfully');
        setSelectedLead(res.data);
        fetchLeads();
      }
    } catch (err) {
      addToast(err.message || 'Failed to log note', 'error');
      throw err;
    }
  };

  // Delete note from lead
  const handleDeleteNote = async (leadId, noteId) => {
    try {
      const res = await api.deleteLeadNote(leadId, noteId);
      if (res.success) {
        addToast('Note removed');
        setSelectedLead(res.data);
        fetchLeads();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete note', 'error');
    }
  };

  // Update follow-up date
  const handleUpdateFollowUpDate = async (leadId, followUpDate) => {
    try {
      const res = await api.updateLead(leadId, { followUpDate });
      if (res.success) {
        addToast('Follow-up date updated');
        setSelectedLead(res.data);
        fetchLeads();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update follow-up date', 'error');
    }
  };

  // Drawer handlers
  const handleOpenDetails = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  // Edit modal handlers
  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="app">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAddModal={handleOpenAdd}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {activeTab === 'crm' ? (
          <div>
            {/* KPI Metrics Dashboard */}
            <StatsOverview
              stats={stats}
              onFilterStatus={(status) => {
                setStatusFilter(status);
              }}
            />

            {/* Leads Data Table with Search, Filter & Quick Updates */}
            <LeadTable
              leads={leads}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onRefresh={handleRefresh}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEdit}
              onDeleteLead={handleDeleteLead}
              onUpdateStatus={handleStatusChange}
            />
          </div>
        ) : (
          /* Simulated External Website Contact Form */
          <ContactFormDemo
            onLeadSubmitted={() => {
              fetchLeads();
              fetchStats();
              addToast('New lead ingested from website contact form!');
            }}
            onSwitchToCrm={() => {
              setActiveTab('crm');
              setStatusFilter('all');
            }}
          />
        )}
      </main>

      {/* Lead Details & Notes Timeline Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onUpdateFollowUpDate={handleUpdateFollowUpDate}
        onUpdateStatus={handleStatusChange}
      />

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          addToast('Logged in as Administrator');
          fetchLeads();
        }}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
