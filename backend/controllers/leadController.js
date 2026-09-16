const { LeadStore } = require('../config/db');

// @desc    Get all leads with optional search, filters, sorting
// @route   GET /api/leads
// @access  Public (or protected based on setting)
async function getLeads(req, res) {
  try {
    const { search, status, source, sortBy } = req.query;
    const leads = await LeadStore.getAll({ search, status, source, sortBy });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving leads',
      error: err.message
    });
  }
}

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Public/Private
async function getLeadById(req, res) {
  try {
    const lead = await LeadStore.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving lead',
      error: err.message
    });
  }
}

// @desc    Create new lead (manual CRM creation)
// @route   POST /api/leads
// @access  Private (or authenticated)
async function createLead(req, res) {
  try {
    const { name, email, phone, company, source, status, message, followUpDate, initialNote } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both client name and email'
      });
    }

    const notes = [];
    if (initialNote && initialNote.trim()) {
      notes.push({
        id: 'note_' + Date.now(),
        content: initialNote.trim(),
        author: req.user ? req.user.name : 'Admin',
        createdAt: new Date().toISOString()
      });
    }

    const newLead = await LeadStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      source: source || 'Website Contact Form',
      status: status || 'new',
      message: message || '',
      followUpDate: followUpDate || '',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (err) {
    console.error('Create lead error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: err.message
    });
  }
}

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
async function updateLead(req, res) {
  try {
    const lead = await LeadStore.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const { name, email, phone, company, source, status, message, followUpDate } = req.body;

    const updated = await LeadStore.update(req.params.id, {
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(company !== undefined && { company: company.trim() }),
      ...(source && { source }),
      ...(status && { status }),
      ...(message !== undefined && { message }),
      ...(followUpDate !== undefined && { followUpDate })
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: err.message
    });
  }
}

// @desc    Quick update status (new / contacted / converted / lost)
// @route   PATCH /api/leads/:id/status
// @access  Private/Public
async function updateLeadStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'converted', 'lost'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const lead = await LeadStore.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const oldStatus = lead.status;
    const author = req.user ? req.user.name : 'Admin';

    // Auto-log a note for the status change
    await LeadStore.addNote(req.params.id, {
      content: `Status updated from "${oldStatus.toUpperCase()}" to "${status.toUpperCase()}"`,
      author
    });

    const updated = await LeadStore.update(req.params.id, { status });

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    console.error('Update lead status error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead status',
      error: err.message
    });
  }
}

// @desc    Add a note or follow-up to a lead
// @route   POST /api/leads/:id/notes
// @access  Private/Public
async function addLeadNote(req, res) {
  try {
    const { content, followUpDate } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty'
      });
    }

    const author = req.user ? req.user.name : (req.body.author || 'Admin');
    const updated = await LeadStore.addNote(req.params.id, {
      content: content.trim(),
      author
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Optionally update follow-up date at the same time
    if (followUpDate !== undefined) {
      await LeadStore.update(req.params.id, { followUpDate });
    }

    const freshLead = await LeadStore.getById(req.params.id);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: freshLead
    });
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: err.message
    });
  }
}

// @desc    Delete a note from a lead
// @route   DELETE /api/leads/:id/notes/:noteId
// @access  Private
async function deleteLeadNote(req, res) {
  try {
    const { id, noteId } = req.params;
    const updated = await LeadStore.deleteNote(id, noteId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lead or note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note removed successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: err.message
    });
  }
}

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
async function deleteLead(req, res) {
  try {
    const deleted = await LeadStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: err.message
    });
  }
}

// @desc    Get dashboard metrics & statistics
// @route   GET /api/leads/stats/summary
// @access  Public
async function getLeadStats(req, res) {
  try {
    const stats = await LeadStore.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lead statistics',
      error: err.message
    });
  }
}

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  addLeadNote,
  deleteLeadNote,
  deleteLead,
  getLeadStats
};
