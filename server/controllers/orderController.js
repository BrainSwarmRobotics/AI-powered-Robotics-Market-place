const Cart = require('../models/Cart');
const Order = require('../models/Order');

const SHIPPING_FLAT_RATE = 500; // placeholder, matches Cart.jsx — real shipping calc is a later task

// POST /api/orders  { shippingAddress }
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address (at least street and city) is required',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    const activeItems = (cart?.items || []).filter((i) => !i.savedForLater);

    if (activeItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Totals computed here, from the real cart — never trust a price the
    // client might send directly.
    const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = SHIPPING_FLAT_RATE;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user.id,
      items: activeItems.map((i) => ({
        product: i.product,
        name: i.name,
        price: i.price,
        image: i.image,
        qty: i.qty,
      })),
      shippingAddress,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
    });

    // Remove only the items that were just ordered — anything saved for
    // later stays in the cart untouched.
    cart.items = cart.items.filter((i) => i.savedForLater);
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/mine
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
