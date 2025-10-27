import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setWishlistItems, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (user?.wishlist) {
      dispatch(setWishlistItems(user.wishlist));
      fetchWishlistProducts(user.wishlist);
    }
  }, [user, dispatch]);

  const fetchWishlistProducts = async (productIds) => {
    try {
      const promises = productIds.map((id) => axios.get(`${API_URL}/products/${id}`));
      const results = await Promise.all(promises);
      setProducts(results.map((res) => res.data.data));
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    setProducts(products.filter((p) => p._id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        quantity: 1,
        size: product.sizes?.[0] || '',
        color: product.colors?.[0]?.name || '',
      })
    );
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">My Wishlist</h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const finalPrice =
                product.price - (product.price * (product.discount || 0)) / 100;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-gold text-navy px-3 py-1 rounded-full text-sm font-bold">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-playfair text-xl font-bold text-navy mb-2 truncate hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-navy">
                        ${finalPrice.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-gold text-navy px-4 py-3 rounded-lg font-semibold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2"
                      >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="px-4 py-3 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiHeart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-playfair text-4xl font-bold text-navy mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Save your favorite items to your wishlist
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold hover:shadow-gold-glow transition-all"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
