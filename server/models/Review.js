const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
