const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
}

// @desc    Register a new admin or agent
// @route   POST /api/auth/register
// @access  Public
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const existing = await UserStore.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists'
      });
    }

    const user = await UserStore.create({
      name,
      email,
      password,
      role: role || 'admin'
    });

    const token = generateToken(user.id || user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: err.message
    });
  }
}

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await UserStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    const token = generateToken(user.id || user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: err.message
    });
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
async function getMe(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve current user',
      error: err.message
    });
  }
}

module.exports = {
  register,
  login,
  getMe
};
