const User = require('../models/User');
const Order = require('../models/Order');

// GET /api/users — list customers (admin/superadmin), search + paginate
exports.getUsers = async (req, res) => {
  try {
    const search = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const filter = { ...search };
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find(filter).sort('-createdAt').skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id — profile + order history (admin/superadmin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orders = await Order.find({ user: user._id }).sort('-createdAt');

    // NOTE: this is "lifetime order value", not collected revenue — COD
    // orders sit at paymentStatus 'Pending' until an admin marks them paid
    // (that flow is C3), so counting only 'Paid' here would understate COD
    // customers. Revisit once C3 adds a real payment-status transition.
    const totalSpent = orders
      .filter((o) => o.paymentStatus === 'Paid' || o.paymentMethod === 'COD')
      .reduce((sum, o) => sum + o.total, 0);

    res.status(200).json({
      success: true,
      user,
      orders,
      orderCount: orders.length,
      totalSpent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};