const express = require('express');
const router = express.Router();
const { getSummary, getSalesAnalytics, getTopProducts } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect, restrictTo('admin', 'superadmin'));

router.get('/summary', getSummary);
router.get('/sales', getSalesAnalytics);
router.get('/top-products', getTopProducts);

module.exports = router;