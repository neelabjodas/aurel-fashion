import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/slices/authSlice';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-navy-sky flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gold rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-gold w-16 h-16 rounded-full flex items-center justify-center gold-shimmer">
                <span className="text-navy font-bold text-2xl font-playfair">A</span>
              </div>
            </div>
          </div>

          <h2 className="font-playfair text-4xl font-bold text-navy text-center mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-navy mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-gold hover:text-gold-dark font-semibold"
              >
                Resend Email
              </button>
            </div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center space-x-2 mt-8 text-gray-600 hover:text-navy transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
