const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsMongoConnected } = require('./config/db');

// Controllers
const authController = require('./controllers/authController');
const leadController = require('./controllers/leadController');
const publicController = require('./controllers/publicController');
const { protect, optionalAuth } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for the demo contact form & client integration
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check & DB status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getIsMongoConnected() ? 'MongoDB' : 'Persistent Local Storage (Ready for MongoDB)',
    version: '1.0.0'
  });
});

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', protect, authController.getMe);

// Public Contact Form Route (Ingests leads directly from website forms)
app.post('/api/public/contact', publicController.submitContactForm);

// Lead Stats Route
app.get('/api/leads/stats/summary', leadController.getLeadStats);

// Lead Management Routes
app.get('/api/leads', leadController.getLeads);
app.get('/api/leads/:id', leadController.getLeadById);
app.post('/api/leads', optionalAuth, leadController.createLead);
app.put('/api/leads/:id', optionalAuth, leadController.updateLead);
app.patch('/api/leads/:id/status', optionalAuth, leadController.updateLeadStatus);
app.post('/api/leads/:id/notes', optionalAuth, leadController.addLeadNote);
app.delete('/api/leads/:id/notes/:noteId', optionalAuth, leadController.deleteLeadNote);
app.delete('/api/leads/:id', optionalAuth, leadController.deleteLead);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error] Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server after initializing DB
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Mini CRM Backend API running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💼 Public Contact Ingestion: http://localhost:${PORT}/api/public/contact`);
    console.log(`🔑 Default Admin: admin@crm.com | admin123`);
    console.log(`=======================================================`);
  });
}

startServer();
