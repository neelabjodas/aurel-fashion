import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isInWishlist = wishlistItems?.includes(product._id);

  const finalPrice = product.price - (product.price * product.discount) / 100;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group relative"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gold transition-all"
      >
        <FiHeart
          className={`w-5 h-5 ${isInWishlist ? 'fill-gold text-gold' : 'text-navy'}`}
        />
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-gold text-navy px-3 py-1 rounded-full text-sm font-bold">
          {product.discount}% OFF
        </div>
      )}

      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-80 bg-gray-100">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-navy bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <button className="bg-gold text-navy px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2">
              <FiShoppingCart />
              <span>Quick Add</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-playfair text-lg font-semibold text-navy mb-2 truncate">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-gold text-gold'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.numReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-navy">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 ? (
            <p className="text-green-600 text-sm mt-2">In Stock</p>
          ) : (
            <p className="text-red-600 text-sm mt-2">Out of Stock</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
