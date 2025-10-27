import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="skeleton h-80 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 bg-gray-200 rounded"></div>
        <div className="skeleton h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="skeleton h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-sky-light rounded-full animate-spin border-t-gold"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-gold rounded-full gold-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
