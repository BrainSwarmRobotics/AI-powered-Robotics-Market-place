const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// ---------- Public / customer ----------

exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || 'newest';

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1, createdAt: -1 },
      lowest: { rating: 1, createdAt: -1 },
    };

    const filter = { product: productId, status: 'approved' };

    const [reviews, totalReviews, summaryAgg] = await Promise.all([
      Review.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name'),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
        { $group: { _id: '$product', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
      ]),
    ]);

    const summary = summaryAgg.length
      ? {
          averageRating: Math.round(summaryAgg[0].averageRating * 10) / 10,
          totalReviews: summaryAgg[0].totalReviews,
        }
      : { averageRating: 0, totalReviews: 0 };

    res.json({
      success: true,
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalReviews / limit)),
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyReviewForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }
    const review = await Review.findOne({ product: productId, user: req.user._id });
    res.json({ success: true, review: review || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Valid productId is required' });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const images = (req.files || []).map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      title: title || '',
      comment: comment.trim(),
      images,
    });

    const populated = await review.populate('user', 'name');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You've already reviewed this product — edit your existing review instead.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own review' });
    }

    const { rating, title, comment } = req.body;
    if (rating !== undefined) {
      const r = Number(rating);
      if (r < 1 || r > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      review.rating = r;
    }
    if (title !== undefined) review.title = title;
    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
      }
      review.comment = comment.trim();
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({ url: file.path, public_id: file.filename }));
      review.images = [...review.images, ...newImages];
    }

    // An edit invalidates prior moderation — an approved review shouldn't
    // stay publicly visible with unreviewed changes.
    review.status = 'pending';

    await review.save();
    const populated = await review.populate('user', 'name');
    res.json({ success: true, review: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    // Best-effort Cloudinary cleanup — a failed image delete shouldn't block
    // deleting the review record itself.
    for (const img of review.images) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error('Cloudinary cleanup failed for', img.public_id, err.message);
        }
      }
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleLikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const uid = req.user._id.toString();
    const idx = review.likes.findIndex((u) => u.toString() === uid);
    let liked;
    if (idx === -1) {
      review.likes.push(req.user._id);
      liked = true;
    } else {
      review.likes.splice(idx, 1);
      liked = false;
    }
    await review.save();
    res.json({ success: true, reviewId: review._id, liked, likeCount: review.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const uid = req.user._id.toString();
    const alreadyReported = review.reports.some((r) => r.user.toString() === uid);
    if (alreadyReported) {
      return res.status(409).json({ success: false, message: "You've already reported this review" });
    }
    review.reports.push({ user: req.user._id, reason: req.body.reason || '' });
    await review.save();
    res.json({ success: true, reviewId: review._id, reportCount: review.reports.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Admin moderation ----------

exports.getAdminReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};

    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.reported === 'true') {
      filter['reports.0'] = { $exists: true };
    }

    const [reviews, totalReviews] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('product', 'name')
        .populate('user', 'name email'),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true,
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalReviews / limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.moderateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('product', 'name')
      .populate('user', 'name email');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};