 // controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token lasts for 30 days
  });
};

// @desc    Register a new user (public — always creates a "customer")
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    // FIX: do NOT pull `role` from req.body here. If we did, anyone could
    // send {"role": "admin"} in the request and self-promote to admin.
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user — role is always the schema default ('customer')
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user email (and explicitly ask for the password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the logged-in user's own profile (includes address)
// @route   GET /api/auth/profile
// NOTE: mount behind `protect` in authRoutes.js
exports.getProfile = async (req, res) => {
  try {
    // req.user is already the full Mongoose doc, set by `protect` middleware
    res.json({
      success: true,
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update the logged-in user's own name/address (not email/password/role)
// @route   PUT /api/auth/profile
// NOTE: mount behind `protect` in authRoutes.js
exports.updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (name !== undefined) req.user.name = name;
    if (address !== undefined) {
      // Merge rather than replace, so a partial address object from the
      // client doesn't wipe out fields it didn't send.
      req.user.address = { ...(req.user.address?.toObject?.() ?? req.user.address), ...address };
    }

    await req.user.save();

    res.json({
      success: true,
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a staff account (admin/superadmin) — protected, superadmin only
// @route   POST /api/auth/create-staff
// NOTE: mount this behind `protect` + `restrictTo('superadmin')` in authRoutes.js
exports.createStaffUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'role must be admin or superadmin' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
