const Stripe = require('stripe');
const Cart = require('../models/Cart');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const SHIPPING_FLAT_RATE = 500; // keep in sync with orderController.js

// POST /api/payments/create-intent
// Computes the amount server-side from the user's real cart — never
// trusts a total the client might send.
exports.createPaymentIntent = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const activeItems = (cart?.items || []).filter((i) => !i.savedForLater);

    if (activeItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = SHIPPING_FLAT_RATE;
    const total = subtotal + shipping;

    // PKR is a 2-decimal currency for Stripe, so the amount is in paisa
    // (smallest unit), same idea as cents for USD.
    const amountInSubunits = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSubunits,
      currency: 'pkr',
      metadata: { userId: req.user.id.toString() },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};