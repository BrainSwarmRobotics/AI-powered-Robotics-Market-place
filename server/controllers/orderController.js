const mongoose = require('mongoose');
const Stripe = require('stripe');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const SHIPPING_FLAT_RATE = 500; // placeholder, matches Cart.jsx — real shipping calc is a later task

// POST /api/orders  { shippingAddress, paymentMethod, paymentIntentId }
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentIntentId } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address (at least street and city) is required',
      });
    }

    if (!['COD', 'Card'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'A valid payment method (COD or Card) is required',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    const activeItems = (cart?.items || []).filter((i) => !i.savedForLater);

    if (activeItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = SHIPPING_FLAT_RATE;
    const total = subtotal + shipping;

    let paymentStatus = 'Pending';

    if (paymentMethod === 'Card') {
      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'paymentIntentId is required for card payments',
        });
      }

      // Never trust the client's claim that payment succeeded — verify
      // directly with Stripe, and cross-check the amount against what
      // we independently computed from the real cart.
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (intent.status !== 'succeeded') {
        return res.status(402).json({
          success: false,
          message: `Payment not completed (status: ${intent.status})`,
        });
      }

      const expectedAmount = Math.round(total * 100);
      if (intent.amount !== expectedAmount || intent.currency !== 'pkr') {
        return res.status(400).json({
          success: false,
          message: 'Payment amount does not match order total',
        });
      }

      if (intent.metadata?.userId !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Payment does not belong to this user',
        });
      }

      paymentStatus = 'Paid';
    }

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
      paymentMethod,
      paymentStatus,
      paymentIntentId: paymentMethod === 'Card' ? paymentIntentId : null,
    });

    // Remove only the items that were just ordered — saved-for-later
    // items stay in the cart untouched.
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

// ======================================================================
// C3 — admin order management
// ======================================================================

const ORDER_STATUS_FLOW = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];
const TERMINAL_STATUSES = ['Delivered', 'Cancelled'];
const REFUND_STATUSES = ['None', 'Requested', 'Approved', 'Rejected', 'Refunded'];

// GET /api/orders/admin?page=&limit=&status=&paymentStatus=&search=
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (search && search.trim()) {
      const term = search.trim();
      const orConditions = [];

      if (mongoose.Types.ObjectId.isValid(term)) {
        orConditions.push({ _id: term });
      }

      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } },
        ],
      }).select('_id');

      if (matchingUsers.length) {
        orConditions.push({ user: { $in: matchingUsers.map((u) => u._id) } });
      }

      if (orConditions.length === 0) {
        return res.json({
          success: true,
          totalOrders: 0,
          currentPage: Number(page),
          totalPages: 0,
          orders: [],
        });
      }

      filter.$or = orConditions;
    }

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)) || 1,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/admin/:id
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/admin/:id/status  { status }
exports.updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [...ORDER_STATUS_FLOW, 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (TERMINAL_STATUSES.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.status} and cannot be changed further`,
      });
    }

    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/admin/:id/refund  { status, reason }
// status transitions through Requested -> Approved/Rejected -> Refunded.
// Admin can also jump straight to any of these — no forced sequence,
// since a real refund conversation often starts outside the app (email/call).
exports.updateOrderRefundAdmin = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!REFUND_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `refund status must be one of ${REFUND_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status === 'Refunded') {
      if (order.refundStatus === 'Refunded') {
        return res.status(400).json({ success: false, message: 'Order already refunded' });
      }

      if (order.paymentMethod === 'Card') {
        if (!order.paymentIntentId) {
          return res.status(400).json({
            success: false,
            message: 'No payment intent on this order — cannot refund via Stripe',
          });
        }
        try {
          const refund = await stripe.refunds.create({ payment_intent: order.paymentIntentId });
          order.stripeRefundId = refund.id;
        } catch (stripeErr) {
          return res.status(502).json({
            success: false,
            message: `Stripe refund failed: ${stripeErr.message}`,
          });
        }
      }
      // COD orders have no payment gateway to call — admin is confirming
      // the cash/manual refund happened outside the system.

      order.refundedAt = new Date();
      order.refundAmount = order.total;
      order.paymentStatus = 'Refunded';
    }

    order.refundStatus = status;
    if (reason !== undefined) order.refundReason = reason;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};