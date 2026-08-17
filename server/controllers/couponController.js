const Coupon = require('../models/Coupon');

function validateCouponPayload({ type, value, minOrderValue, maxDiscount, expiresAt }) {
  if (!['percentage', 'fixed'].includes(type)) {
    return 'type must be "percentage" or "fixed"';
  }
  if (value === undefined || value === null || Number(value) <= 0) {
    return 'value must be a positive number';
  }
  if (type === 'percentage' && Number(value) > 100) {
    return 'percentage value cannot exceed 100';
  }
  if (minOrderValue !== undefined && minOrderValue !== null && Number(minOrderValue) < 0) {
    return 'minOrderValue cannot be negative';
  }
  if (maxDiscount !== undefined && maxDiscount !== null && Number(maxDiscount) < 0) {
    return 'maxDiscount cannot be negative';
  }
  if (!expiresAt || isNaN(new Date(expiresAt).getTime())) {
    return 'a valid expiresAt date is required';
  }
  if (new Date(expiresAt) <= new Date()) {
    return 'expiresAt must be in the future';
  }
  return null;
}

// POST /api/coupons
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrderValue, maxDiscount, startsAt, expiresAt, usageLimit, isActive } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'code is required' });
    }

    const validationError = validateCouponPayload({ type, value, minOrderValue, maxDiscount, expiresAt });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const normalizedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) {
      return res.status(409).json({ success: false, message: `Coupon code "${normalizedCode}" already exists` });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      type,
      value,
      minOrderValue: minOrderValue || 0,
      maxDiscount: type === 'percentage' ? (maxDiscount || null) : null,
      startsAt: startsAt || Date.now(),
      expiresAt,
      usageLimit: usageLimit || null,
      isActive: isActive === undefined ? true : isActive,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/coupons?page=&limit=&search=&isActive=&type=
exports.getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive, type } = req.query;
    const filter = {};
    if (search) filter.code = { $regex: search.trim(), $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (type) filter.type = type;

    const totalCoupons = await Coupon.countDocuments(filter);
    const coupons = await Coupon.find(filter)
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      totalCoupons,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCoupons / Number(limit)) || 1,
      coupons,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/coupons/:id
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/coupons/:id
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const { code, type, value, minOrderValue, maxDiscount, startsAt, expiresAt, usageLimit, isActive } = req.body;

    const nextType = type || coupon.type;
    const nextValue = value === undefined ? coupon.value : value;
    const nextExpiresAt = expiresAt || coupon.expiresAt;

    const validationError = validateCouponPayload({
      type: nextType,
      value: nextValue,
      minOrderValue: minOrderValue === undefined ? coupon.minOrderValue : minOrderValue,
      maxDiscount: maxDiscount === undefined ? coupon.maxDiscount : maxDiscount,
      expiresAt: nextExpiresAt,
    });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (code && code.trim().toUpperCase() !== coupon.code) {
      const normalizedCode = code.trim().toUpperCase();
      const existing = await Coupon.findOne({ code: normalizedCode });
      if (existing) {
        return res.status(409).json({ success: false, message: `Coupon code "${normalizedCode}" already exists` });
      }
      coupon.code = normalizedCode;
    }

    coupon.type = nextType;
    coupon.value = nextValue;
    if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue;
    if (maxDiscount !== undefined) coupon.maxDiscount = nextType === 'percentage' ? maxDiscount : null;
    if (startsAt !== undefined) coupon.startsAt = startsAt;
    coupon.expiresAt = nextExpiresAt;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};