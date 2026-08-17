const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  updateOrderRefundAdmin,
} = require('../controllers/orderController');
const { getInvoice } = require('../controllers/invoiceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);

// --- Admin (C3) — must stay above the generic '/:id' route below ---
router.get('/admin', protect, restrictTo('admin', 'superadmin'), getAllOrdersAdmin);
router.get('/admin/:id', protect, restrictTo('admin', 'superadmin'), getOrderByIdAdmin);
router.patch('/admin/:id/status', protect, restrictTo('admin', 'superadmin'), updateOrderStatusAdmin);
router.patch('/admin/:id/refund', protect, restrictTo('admin', 'superadmin'), updateOrderRefundAdmin);

router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, getInvoice);

module.exports = router;