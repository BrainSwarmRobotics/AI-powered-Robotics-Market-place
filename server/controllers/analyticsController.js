const mongoose = require('mongoose');
const Order = require('../models/Order');

// Orders counted toward revenue/sales figures. Mirrors the C2 totalSpent
// stopgap (Paid OR COD counts as a "real" sale) but tightened for C3:
// excludes Cancelled orders and Refunded payments outright, since those
// were added after C2 shipped and shouldn't inflate revenue.
const COUNTED_ORDER_MATCH = {
  status: { $ne: 'Cancelled' },
  paymentStatus: { $ne: 'Refunded' },
  $or: [{ paymentStatus: 'Paid' }, { paymentMethod: 'COD' }],
};

function parseDays(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

// GET /api/analytics/summary
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [overall, thisMonth, lastMonth, refundsPending] = await Promise.all([
      Order.aggregate([
        { $match: COUNTED_ORDER_MATCH },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { ...COUNTED_ORDER_MATCH, createdAt: { $gte: startOfThisMonth } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            ...COUNTED_ORDER_MATCH,
            createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
          },
        },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      ]),
      Order.countDocuments({ refundStatus: 'Requested' }),
    ]);

    const totalRevenue = overall[0]?.revenue || 0;
    const totalOrders = overall[0]?.orders || 0;
    const revenueThisMonth = thisMonth[0]?.revenue || 0;
    const revenueLastMonth = lastMonth[0]?.revenue || 0;
    const ordersThisMonth = thisMonth[0]?.orders || 0;
    const ordersLastMonth = lastMonth[0]?.orders || 0;

    const revenueChangePct =
      revenueLastMonth > 0
        ? Number((((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1))
        : null; // null = no basis for comparison (no revenue last month), not 0%

    res.json({
      success: true,
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      revenueThisMonth,
      revenueLastMonth,
      revenueChangePct,
      ordersThisMonth,
      ordersLastMonth,
      pendingRefundRequests: refundsPending,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/analytics/sales?period=daily|weekly|monthly&days=30
exports.getSalesAnalytics = async (req, res) => {
  try {
    const period = ['daily', 'weekly', 'monthly'].includes(req.query.period)
      ? req.query.period
      : 'daily';

    const defaultDays = { daily: 30, weekly: 84, monthly: 365 }[period];
    const days = parseDays(req.query.days, defaultDays);

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const dateFormat =
      period === 'daily' ? '%Y-%m-%d' : period === 'monthly' ? '%Y-%m' : '%G-W%V';

    const rows = await Order.aggregate([
      { $match: { ...COUNTED_ORDER_MATCH, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const byLabel = new Map(rows.map((r) => [r._id, { revenue: r.revenue, orders: r.orders }]));

    let data;
    if (period === 'weekly') {
      // ISO-week buckets aren't zero-filled — gaps in weeks with zero
      // orders are simply absent from the array rather than shown as 0.
      // Daily/monthly are zero-filled below for a continuous chart line;
      // weekly bucket math (ISO year-week) is fiddly enough that this was
      // left as a known simplification rather than guessed at.
      data = rows.map((r) => ({ label: r._id, revenue: r.revenue, orders: r.orders }));
    } else {
      data = [];
      const cursor = new Date(since);
      const end = new Date();
      while (cursor <= end) {
        const label =
          period === 'monthly'
            ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
            : cursor.toISOString().slice(0, 10);
        const bucket = byLabel.get(label);
        data.push({ label, revenue: bucket?.revenue || 0, orders: bucket?.orders || 0 });
        if (period === 'monthly') {
          cursor.setMonth(cursor.getMonth() + 1);
        } else {
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    }

    res.json({ success: true, period, days, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/analytics/top-products?sortBy=revenue|units&limit=10
exports.getTopProducts = async (req, res) => {
  try {
    const sortBy = req.query.sortBy === 'units' ? 'unitsSold' : 'revenue';
    const limit = Math.min(parseDays(req.query.limit, 10), 50);

    const rows = await Order.aggregate([
      { $match: COUNTED_ORDER_MATCH },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          unitsSold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { [sortBy]: -1 } },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      sortBy,
      products: rows.map((r) => ({
        productId: r._id,
        name: r.name,
        unitsSold: r.unitsSold,
        revenue: r.revenue,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};