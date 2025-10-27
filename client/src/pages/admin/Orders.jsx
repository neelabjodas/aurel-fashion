import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { FiEye, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('Order status updated!');
      dispatch(getAllOrders());
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">Manage Orders</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === status
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left py-4 px-6">Order ID</th>
                  <th className="text-left py-4 px-6">Customer</th>
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-left py-4 px-6">Total</th>
                  <th className="text-left py-4 px-6">Payment</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-4 px-6">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-1 rounded-lg border-2 border-gray-300 focus:border-gold focus:outline-none font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-gold hover:bg-gold hover:text-navy rounded-lg transition-colors">
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <FiPackage className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="font-playfair text-3xl font-bold text-navy mb-4">
              No orders found
            </h3>
            <p className="text-gray-600">No orders match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
