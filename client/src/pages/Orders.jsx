import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../redux/slices/orderSlice';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { PageLoader } from '../components/LoadingSkeleton';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'Processing':
        return <FiPackage className="w-6 h-6 text-blue-500" />;
      case 'Shipped':
        return <FiTruck className="w-6 h-6 text-purple-500" />;
      case 'Delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <FiClock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">My Orders</h1>

        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="font-playfair text-2xl font-bold text-navy mb-2">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-navy">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-navy">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-navy">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex justify-end space-x-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-6 py-3 rounded-lg border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-navy transition-all"
                    >
                      View Details
                    </Link>
                    {order.status === 'Delivered' && (
                      <button className="px-6 py-3 rounded-lg bg-gradient-gold text-navy font-semibold hover:shadow-gold-glow transition-all">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiPackage className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-playfair text-4xl font-bold text-navy mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't placed any orders yet
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold hover:shadow-gold-glow transition-all"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
