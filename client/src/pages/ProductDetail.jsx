import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import ReviewCard from '../components/ReviewCard';
import ProductCard from '../components/ProductCard';
import { PageLoader } from '../components/LoadingSkeleton';
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiTruck, FiRotateCcw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct: product, loading, products } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(getProduct(id));
    fetchReviews();
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors?.length > 0) setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews/product/${id}`);
      setReviews(data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
    );
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    const isInWishlist = wishlistItems?.includes(product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/reviews`,
        {
          product: product._id,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading || !product) return <PageLoader />;

  const isInWishlist = wishlistItems?.includes(product._id);
  const finalPrice = product.price - (product.price * product.discount) / 100;
  const relatedProducts = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 rounded-xl overflow-hidden"
              >
                <img
                  src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-[600px] object-cover"
                />
              </motion.div>

              <div className="flex space-x-4 overflow-x-auto">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-gold' : 'border-gray-200'
                    }`}
                  >
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="font-playfair text-4xl font-bold text-navy mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-navy">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-gold text-navy px-3 py-1 rounded-full font-bold">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-gold bg-gold text-navy'
                            : 'border-gray-300 hover:border-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedColor === color.name
                            ? 'border-gold bg-gold text-navy'
                            : 'border-gray-300 hover:border-gold'
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-navy mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gold font-bold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-navy w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gold font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <FiCheck className="w-5 h-5" />
                    <span className="font-semibold">
                      In Stock ({product.stock} available)
                    </span>
                  </div>
                ) : (
                  <div className="text-red-600 font-semibold">Out of Stock</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="px-6 py-4 rounded-lg border-2 border-gold hover:bg-gold transition-all"
                >
                  <FiHeart
                    className={`w-6 h-6 ${
                      isInWishlist ? 'fill-gold text-gold' : 'text-gold'
                    }`}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiTruck className="w-5 h-5 text-gold" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiRotateCcw className="w-5 h-5 text-gold" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiCheck className="w-5 h-5 text-gold" />
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-playfair text-3xl font-bold text-navy">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-all"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block font-semibold text-navy mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <FiStar
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? 'fill-gold text-gold'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold text-navy mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gold text-navy px-6 py-3 rounded-lg font-semibold hover:shadow-gold-glow transition-all"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 hover:border-gold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewCard key={review._id} review={review} />)
            ) : (
              <p className="text-center text-gray-600 py-8">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-playfair text-3xl font-bold text-navy mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
