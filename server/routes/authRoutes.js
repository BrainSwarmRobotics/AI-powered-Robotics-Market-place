// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, createStaffUser } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected: only an existing superadmin can create admin/superadmin accounts
router.post('/create-staff', protect, restrictTo('superadmin'), createStaffUser);

module.exports = router;