import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/orders`, config),
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/users/all`, config).catch(() => ({ data: { data: [] } })),
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];
      const users = usersRes.data.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-gold',
      gradient: 'from-gold-light to-gold-dark',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-5xl font-bold text-navy">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiActivity className="w-5 h-5 animate-pulse text-green-500" />
            <span>Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stat.gradient} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold mb-2">{stat.title}</p>
                    <p className="text-white text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-12 h-12 text-white opacity-80" />
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center text-sm text-green-600">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-3xl font-bold text-navy">Recent Orders</h2>
              <Link to="/admin/orders" className="text-gold hover:text-gold-dark font-semibold">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="py-3 px-4">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="py-3 px-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">No orders yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/admin/products"
                className="block w-full bg-gradient-navy-sky text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-center"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="block w-full bg-gradient-gold text-navy px-6 py-4 rounded-lg font-semibold hover:shadow-gold-glow transition-all text-center"
              >
                Manage Orders
              </Link>
              <Link
                to="/admin/users"
                className="block w-full border-2 border-navy text-navy px-6 py-4 rounded-lg font-semibold hover:bg-navy hover:text-white transition-all text-center"
              >
                Manage Users
              </Link>
            </div>

            {/* Sales Chart Placeholder */}
            <div className="mt-8 p-6 bg-gradient-to-br from-navy to-navy-light rounded-lg gold-shimmer">
              <h3 className="font-playfair text-xl font-bold text-white mb-4">
                Monthly Revenue
              </h3>
              <div className="text-4xl font-bold text-gold mb-2">
                ${(stats.totalRevenue / 12).toFixed(2)}
              </div>
              <p className="text-sky-light text-sm">Average per month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
