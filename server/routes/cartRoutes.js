const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // confirm this export name matches your file
const cartController = require('../controllers/cartController');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:itemId', cartController.updateItemQty);
router.delete('/items/:itemId', cartController.removeItem);
router.patch('/items/:itemId/save-for-later', cartController.toggleSaveForLater);
router.delete('/', cartController.clearCart);

module.exports = router;