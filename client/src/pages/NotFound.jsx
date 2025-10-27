import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-navy-sky flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-playfair text-9xl font-bold text-gold mb-6 gold-shimmer">404</h1>
        <h2 className="font-playfair text-5xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-2xl text-sky-light mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all"
        >
          <FiHome />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
