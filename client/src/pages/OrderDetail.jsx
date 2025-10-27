import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../redux/slices/orderSlice';
import { FiPackage, FiTruck, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { PageLoader } from '../components/LoadingSkeleton';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  if (loading || !order) return <PageLoader />;

  const getStatusSteps = () => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(order.status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/orders"
          className="inline-flex items-center text-gold hover:text-gold-dark mb-6"
        >
          ← Back to Orders
        </Link>

        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">
          Order Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-6">
                Order Status
              </h2>

              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{
                      width: `${
                        (statusSteps.filter((s) => s.completed).length / statusSteps.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.name} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                          step.completed
                            ? 'bg-gold border-gold text-navy'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <FiCheckCircle className="w-6 h-6" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-semibold ${
                          step.completed ? 'text-navy' : 'text-gray-400'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-6">
                Order Items
              </h2>

              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-6 pb-6 border-b border-gray-200 last:border-0"
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-bold text-navy mb-2">
                        {item.name}
                      </h3>
                      <div className="text-gray-600 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-navy">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FiMapPin className="w-6 h-6 text-gold" />
                <h2 className="font-playfair text-2xl font-bold text-navy">
                  Shipping Address
                </h2>
              </div>

              <div className="text-gray-700 space-y-1">
                <p className="font-semibold text-navy">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Order ID</span>
                  <span className="font-semibold">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Order Date</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Payment Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Payment Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {order.shippingPrice === 0
                      ? 'FREE'
                      : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-2xl font-bold text-navy">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {order.status === 'Delivered' && (
                <button className="w-full bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold hover:shadow-gold-glow transition-all mb-4">
                  Leave a Review
                </button>
              )}

              <button className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 font-semibold hover:border-gold transition-all">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
