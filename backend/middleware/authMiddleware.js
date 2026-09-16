const jwt = require('jsonwebtoken');
const { UserStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_leadpulse_crm_2026';

// Protect routes requiring authentication
async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserStore.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired.'
    });
  }
}

// Optional auth for public or flexible endpoints
async function optionalAuth(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await UserStore.findById(decoded.id);
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

module.exports = { protect, optionalAuth, JWT_SECRET };
