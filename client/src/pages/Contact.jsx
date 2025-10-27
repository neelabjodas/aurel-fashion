import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending email
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-navy-sky py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-6xl font-bold text-white mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-sky-light"
          >
            We're here to help and answer any question you might have
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                  <FiPhone className="w-7 h-7 text-navy" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-navy">
                    Phone
                  </h3>
                  <p className="text-gray-600">Give us a call</p>
                </div>
              </div>
              <a
                href="tel:9827193800"
                className="text-lg text-gold hover:text-gold-dark font-semibold"
              >
                9827193800
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                  <FiMail className="w-7 h-7 text-navy" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-navy">
                    Email
                  </h3>
                  <p className="text-gray-600">Send us an email</p>
                </div>
              </div>
              <a
                href="mailto:despacito1241@gmail.com"
                className="text-lg text-gold hover:text-gold-dark font-semibold break-all"
              >
                despacito1241@gmail.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                  <FiMapPin className="w-7 h-7 text-navy" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-navy">
                    Address
                  </h3>
                  <p className="text-gray-600">Visit our office</p>
                </div>
              </div>
              <p className="text-gray-700">
                Fashion District<br />
                Style Avenue<br />
                CA 90015, USA
              </p>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-gold rounded-lg shadow-lg p-8 gold-shimmer"
            >
              <h3 className="font-playfair text-2xl font-bold text-navy mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-navy">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="font-playfair text-4xl font-bold text-navy mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-navy mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center space-x-2 bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all disabled:opacity-50"
              >
                <FiSend />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
