import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5,
    comment: 'Absolutely love the quality and style! Aurel has become my go-to fashion destination.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Professional Stylist',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 5,
    comment: 'The attention to detail is impeccable. Every piece feels luxurious and well-crafted.',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Business Executive',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    rating: 5,
    comment: 'Perfect blend of elegance and comfort. The customer service is outstanding!',
  },
  {
    id: 4,
    name: 'David Martinez',
    role: 'Creative Director',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    rating: 5,
    comment: 'Innovative designs that stand out. Aurel is redefining modern fashion.',
  },
  {
    id: 5,
    name: 'Jessica Brown',
    role: 'Influencer',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    rating: 5,
    comment: 'Every order exceeds expectations. The packaging alone is worth it!',
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    rating: 5,
    comment: 'Fast shipping, premium quality, and timeless style. Highly recommended!',
  },
  {
    id: 7,
    name: 'Olivia Davis',
    role: 'Model',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    rating: 5,
    comment: 'The fabrics are divine! I feel confident and stylish in every piece.',
  },
  {
    id: 8,
    name: 'Robert Taylor',
    role: 'Photographer',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    rating: 5,
    comment: 'Exceptional craftsmanship. These pieces photograph beautifully!',
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative py-16 bg-gradient-navy-sky overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-white">
          What Our Customers Say
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-20 h-20 rounded-full border-4 border-gold mb-6"
              />

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-6 h-6 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-xl text-gray-700 mb-6 italic">
                "{currentTestimonial.comment}"
              </p>

              <h4 className="font-playfair text-2xl font-bold text-navy">
                {currentTestimonial.name}
              </h4>
              <p className="text-gold font-semibold">{currentTestimonial.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-gold w-8' : 'bg-white opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
