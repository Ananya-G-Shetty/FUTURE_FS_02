const { LeadStore } = require('../config/db');

// @desc    Ingest lead from external website contact form
// @route   POST /api/public/contact
// @access  Public (CORS open for website forms)
async function submitContactForm(req, res) {
  try {
    const { name, email, phone, company, message, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to submit the inquiry form.'
      });
    }

    // Email regex validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const initialNote = {
      id: 'note_form_' + Date.now(),
      content: message
        ? `Website Inquiry: "${message}"`
        : 'Inquiry submitted through website contact form.',
      author: 'System (Website Form)',
      createdAt: new Date().toISOString()
    };

    const newLead = await LeadStore.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      source: source || 'Website Contact Form',
      status: 'new',
      message: message ? message.trim() : '',
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // default follow-up in 2 days
      notes: [initialNote]
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our sales team will get back to you shortly.',
      leadId: newLead.id || newLead._id
    });
  } catch (err) {
    console.error('Contact form submission error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process contact form submission',
      error: err.message
    });
  }
}

module.exports = {
  submitContactForm
};
