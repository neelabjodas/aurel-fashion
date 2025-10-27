import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-navy shadow-navy-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gold rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center gold-shimmer">
                <span className="text-navy font-bold text-xl font-playfair">A</span>
              </div>
            </div>
            <span className="text-white font-playfair text-3xl font-bold tracking-wider">
              AUREL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-gold transition-colors font-poppins font-medium"
            >
              Home
            </Link>
            <Link
              to="/products?category=Men"
              className="text-white hover:text-gold transition-colors font-poppins font-medium"
            >
              Men
            </Link>
            <Link
              to="/products?category=Women"
              className="text-white hover:text-gold transition-colors font-poppins font-medium"
            >
              Women
            </Link>
            <Link
              to="/products?category=Accessories"
              className="text-white hover:text-gold transition-colors font-poppins font-medium"
            >
              Accessories
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-gold transition-colors font-poppins font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-gold transition-colors"
            >
              <FiSearch className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="text-white hover:text-gold transition-colors relative"
              >
                <FiHeart className="w-6 h-6" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="text-white hover:text-gold transition-colors relative"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gold transition-colors"
                >
                  <img
                    src={user?.profilePicture || 'https://via.placeholder.com/40'}
                    alt={user?.firstName}
                    className="w-8 h-8 rounded-full border-2 border-gold"
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-navy hover:bg-sky-light transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-navy hover:bg-sky-light transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-navy hover:bg-sky-light transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-sky-light transition-colors flex items-center space-x-2"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gold transition-colors"
              >
                <FiUser className="w-6 h-6" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4"
            >
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  type="submit"
                  className="bg-gold text-navy px-6 py-2 rounded-r-lg font-semibold hover:bg-gold-light transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-light"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-white hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products?category=Men"
                className="block text-white hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                to="/products?category=Women"
                className="block text-white hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                to="/products?category=Accessories"
                className="block text-white hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                to="/contact"
                className="block text-white hover:text-gold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
