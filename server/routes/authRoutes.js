// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  createStaffUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Logged-in user's own profile (name + address, for checkout)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Protected: only an existing superadmin can create admin/superadmin accounts
router.post('/create-staff', protect, restrictTo('superadmin'), createStaffUser);

module.exports = router;
