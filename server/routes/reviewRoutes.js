const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/product/:productId').get(getProductReviews);
router.route('/').post(protect, createReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
