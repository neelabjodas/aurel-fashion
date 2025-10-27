import React from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-start space-x-4">
        <img
          src={review.user?.profilePicture || 'https://via.placeholder.com/50'}
          alt={review.user?.firstName}
          className="w-12 h-12 rounded-full border-2 border-gold"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-navy">
              {review.user?.firstName} {review.user?.lastName}
            </h4>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-gray-700">{review.comment}</p>

          {/* Helpful Button */}
          <button className="mt-4 text-sm text-sky hover:text-gold transition-colors">
            Helpful ({review.helpful || 0})
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
