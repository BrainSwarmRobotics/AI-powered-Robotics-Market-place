const express = require('express');
const router = express.Router();
const uploadReviewImages = require('../config/multerReviews');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getReviewsForProduct,
  getMyReviewForProduct,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  reportReview,
  getAdminReviews,
  moderateReviewStatus,
} = require('../controllers/reviewController');

// Admin routes — same ordering rule as productRoutes/orderRoutes: these must
// be registered before the "/:id"-style routes below, or "admin" gets
// parsed as a review id and never reaches the real handler.
router.get('/admin', protect, restrictTo('admin', 'superadmin'), getAdminReviews);
router.patch('/admin/:id/status', protect, restrictTo('admin', 'superadmin'), moderateReviewStatus);

// Public / customer routes
router.get('/product/:productId', getReviewsForProduct);
router.get('/product/:productId/mine', protect, getMyReviewForProduct);
router.post('/', protect, uploadReviewImages.array('images', 3), createReview);
router.put('/:id', protect, uploadReviewImages.array('images', 3), updateReview);
router.delete('/:id', protect, deleteReview); // owner or admin, checked in controller
router.patch('/:id/like', protect, toggleLikeReview);
router.post('/:id/report', protect, reportReview);

module.exports = router;