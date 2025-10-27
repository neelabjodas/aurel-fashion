const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

router.route('/address').post(protect, addAddress);
router
  .route('/address/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router
  .route('/wishlist/:productId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

router.route('/cart').post(protect, addToCart).delete(protect, clearCart);
router
  .route('/cart/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
