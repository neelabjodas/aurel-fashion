import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-gold w-10 h-10 rounded-full flex items-center justify-center gold-shimmer">
                <span className="text-navy font-bold text-lg font-playfair">A</span>
              </div>
              <span className="text-white font-playfair text-2xl font-bold">AUREL</span>
            </div>
            <p className="text-sky-light text-sm">
              Elevating fashion with timeless elegance and modern sophistication.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky hover:text-gold transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky hover:text-gold transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky hover:text-gold transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sky-light hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sky-light hover:text-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sky-light hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sky-light hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4 text-gold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sky-light hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sky-light hover:text-gold transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sky-light hover:text-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sky-light hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4 text-gold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sky-light">
                <FiPhone className="w-5 h-5 text-gold" />
                <a href="tel:9827193800" className="hover:text-gold transition-colors">
                  9827193800
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sky-light">
                <FiMail className="w-5 h-5 text-gold" />
                <a
                  href="mailto:despacito1241@gmail.com"
                  className="hover:text-gold transition-colors"
                >
                  despacito1241@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sky-light">
                <FiMapPin className="w-5 h-5 text-gold mt-1" />
                <span>Fashion District, Style Avenue, CA 90015</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-navy-light">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-playfair text-xl font-semibold mb-4 text-gold">
              Subscribe to Our Newsletter
            </h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="bg-gradient-gold text-navy px-6 py-3 rounded-r-lg font-semibold hover:shadow-gold-glow transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-navy-light text-center text-sky-light text-sm">
          <p>&copy; {new Date().getFullYear()} Aurel Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
