import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import TestimonialSlider from '../components/TestimonialSlider';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const trendingProducts = products.filter((p) => p.trending).slice(0, 8);

  const heroSlides = [
    {
      title: 'Elevate Your Style',
      subtitle: 'Discover Timeless Elegance',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
      link: '/products',
    },
    {
      title: 'New Arrivals',
      subtitle: 'Fall/Winter Collection 2024',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
      link: '/products?sort=newest',
    },
    {
      title: 'Premium Quality',
      subtitle: 'Crafted with Perfection',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
      link: '/products?featured=true',
    },
  ];

  const categories = [
    {
      name: 'Men',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
      link: '/products?category=Men',
    },
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
      link: '/products?category=Women',
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&q=80',
      link: '/products?category=Accessories',
    },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-navy bg-opacity-60 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-white max-w-4xl px-4"
                  >
                    <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6 gold-shimmer">
                      {slide.title}
                    </h1>
                    <p className="text-2xl md:text-3xl mb-8 text-sky-light">
                      {slide.subtitle}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center space-x-2 bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all"
                    >
                      <span>Shop Now</span>
                      <FiArrowRight className="w-6 h-6" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-5xl font-bold text-navy mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover our curated collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              >
                <Link to={category.link}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent flex items-end justify-center pb-12">
                    <h3 className="font-playfair text-4xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FiStar className="w-8 h-8 text-gold" />
              <h2 className="font-playfair text-5xl font-bold text-navy">
                Featured Products
              </h2>
              <FiStar className="w-8 h-8 text-gold" />
            </div>
            <p className="text-xl text-gray-600">
              Handpicked selections just for you
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products?featured=true"
              className="inline-flex items-center space-x-2 bg-navy text-white px-8 py-4 rounded-lg font-bold hover:bg-navy-light transition-all"
            >
              <span>View All Featured</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FiTrendingUp className="w-8 h-8 text-gold" />
              <h2 className="font-playfair text-5xl font-bold text-navy">
                Trending Now
              </h2>
              <FiTrendingUp className="w-8 h-8 text-gold" />
            </div>
            <p className="text-xl text-gray-600">
              What's hot in fashion right now
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products?trending=true"
              className="inline-flex items-center space-x-2 bg-navy text-white px-8 py-4 rounded-lg font-bold hover:bg-navy-light transition-all"
            >
              <span>View All Trending</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Newsletter */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-5xl font-bold text-white mb-6">
              Join Our Style Community
            </h2>
            <p className="text-xl text-sky-light mb-8">
              Subscribe to get exclusive offers, style tips, and early access to new collections
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-l-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="bg-gradient-gold text-navy px-8 py-4 rounded-r-lg font-bold hover:shadow-gold-glow transition-all"
              >
                Subscribe
              </button>
            </form>

            <p className="text-sky-light text-sm mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Dedicated customer service' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
