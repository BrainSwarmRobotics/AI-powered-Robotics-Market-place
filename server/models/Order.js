const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: null },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      // 'Cancelled' added in C3 — original enum had no way to represent a
      // cancelled/refunded order, which the refund flow below needs.
      enum: ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card'],
      required: true,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      // 'Refunded' added in C3.
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentIntentId: { type: String, default: null },

    // --- C3: refund tracking ---
    refundStatus: {
      type: String,
      enum: ['None', 'Requested', 'Approved', 'Rejected', 'Refunded'],
      default: 'None',
    },
    refundReason: { type: String, default: '' }, // admin note, not customer-facing yet
    refundAmount: { type: Number, default: null },
    refundedAt: { type: Date, default: null },
    stripeRefundId: { type: String, default: null }, // only set for Card orders refunded via Stripe
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);