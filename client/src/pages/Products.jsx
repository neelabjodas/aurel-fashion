import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
    trending: searchParams.get('trending') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      search: '',
      featured: '',
      trending: '',
    });
    setSearchParams({});
  };

  const categories = ['Men', 'Women', 'Accessories', 'Kids'];
  const subCategories = [
    'T-Shirts',
    'Shirts',
    'Jeans',
    'Trousers',
    'Dresses',
    'Tops',
    'Skirts',
    'Jackets',
    'Sweaters',
    'Bags',
    'Shoes',
    'Watches',
    'Jewelry',
    'Sunglasses',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-navy mb-2">
              {filters.category || 'All Products'}
            </h1>
            <p className="text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-lg"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="md:w-64 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-navy">Filters</h2>
                  {Object.values(filters).some((v) => v) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-navy"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat}
                          onChange={() => handleFilterChange('category', cat)}
                          className="text-gold focus:ring-gold"
                        />
                        <span className="text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sub-Category Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Sub-Category</h3>
                  <select
                    value={filters.subCategory}
                    onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">All</option>
                    {subCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <h3 className="font-semibold text-navy mb-3">Sort By</h3>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Special Filters */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured === 'true'}
                      onChange={(e) =>
                        handleFilterChange('featured', e.target.checked ? 'true' : '')
                      }
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">Featured Only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.trending === 'true'}
                      onChange={(e) =>
                        handleFilterChange('trending', e.target.checked ? 'true' : '')
                      }
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">Trending Only</span>
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="font-playfair text-3xl font-bold text-navy mb-4">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
