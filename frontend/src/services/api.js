const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('leadpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Leads
  async getLeads(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.source && params.source !== 'all') query.append('source', params.source);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/leads${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getLeadById(id) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createLead(leadData) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    return handleResponse(res);
  },

  async updateLead(id, updateData) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  async updateLeadStatus(id, status) {
    const res = await fetch(`${API_BASE}/leads/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async addLeadNote(id, { content, followUpDate, author }) {
    const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, followUpDate, author })
    });
    return handleResponse(res);
  },

  async deleteLeadNote(id, noteId) {
    const res = await fetch(`${API_BASE}/leads/${id}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async deleteLead(id) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getLeadStats() {
    const res = await fetch(`${API_BASE}/leads/stats/summary`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Public website contact submission
  async submitPublicContact(formData) {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return handleResponse(res);
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
