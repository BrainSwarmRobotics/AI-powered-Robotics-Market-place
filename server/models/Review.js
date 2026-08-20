const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, trim: true, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    comment: { type: String, required: true, trim: true },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    // Moderation gate — new/edited reviews start 'pending' and only
    // 'approved' reviews are ever shown on the public product page or
    // counted in the rating summary / future C4 analytics.
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reports: [reportSchema],
  },
  { timestamps: true }
);

// One review per user per product. createReview relies on this — a
// duplicate insert throws a Mongo E11000 error, which the controller
// catches and turns into a friendly 409.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});
reviewSchema.virtual('reportCount').get(function () {
  return this.reports.length;
});
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);