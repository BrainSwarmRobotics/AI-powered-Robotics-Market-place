const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', protect, restrictTo('admin', 'superadmin'), getUsers);
router.get('/:id', protect, restrictTo('admin', 'superadmin'), getUserById);

module.exports = router;