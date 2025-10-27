import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: user?.country || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (user?.addresses) {
      setSavedAddresses(user.addresses);
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setShippingAddress(defaultAddress);
      }
    }
  }, [user]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price - (price * discount) / 100;
      return total + finalPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const selectSavedAddress = (address) => {
    setShippingAddress(address);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const token = localStorage.getItem('token');
      const { data: paymentData } = await axios.post(
        `${API_URL}/payment/create-intent`,
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Confirm card payment
      let paymentResult = {};
      if (paymentMethod === 'card') {
        const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingAddress.fullName,
            },
          },
        });

        if (result.error) {
          toast.error(result.error.message);
          setLoading(false);
          return;
        }

        paymentResult = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          update_time: new Date().toISOString(),
        };
      }

      // Create order
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images?.[0]?.url,
          price: item.product.price - (item.product.price * (item.product.discount || 0)) / 100,
        })),
        shippingAddress,
        paymentMethod,
        paymentResult,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      const order = await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart
      dispatch(clearCart());

      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, title: 'Shipping' },
              { num: 2, title: 'Payment' },
              { num: 3, title: 'Review' },
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num
                      ? 'bg-gold text-navy'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? <FiCheck /> : s.num}
                </div>
                <span className="ml-3 font-semibold hidden sm:block">{s.title}</span>
                {s.num < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      step > s.num ? 'bg-gold' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-lg p-8"
                >
                  <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                    Shipping Address
                  </h2>

                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-navy mb-3">
                        Saved Addresses
                      </h3>
                      <div className="space-y-3">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr._id}
                            type="button"
                            onClick={() => selectSavedAddress(addr)}
                            className="w-full text-left p-4 border-2 rounded-lg hover:border-gold transition-colors"
                          >
                            <div className="font-semibold">{addr.label}</div>
                            <div className="text-sm text-gray-600">
                              {addr.addressLine1}, {addr.city}, {addr.state}{' '}
                              {addr.postalCode}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="my-4 text-center text-gray-500">or</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-navy mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-navy mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="mt-6 w-full bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-lg p-8"
                >
                  <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <FiCreditCard className="w-6 h-6 text-gold" />
                      <span className="font-semibold">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="font-semibold">UPI</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={paymentMethod === 'netbanking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="font-semibold">Net Banking</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="font-semibold">Cash on Delivery</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                      <label className="block font-semibold text-navy mb-3">
                        Card Details
                      </label>
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#0b132b',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-6">
                    <FiLock className="text-gold" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 font-semibold hover:border-gold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Shipping Address Review */}
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-playfair text-2xl font-bold text-navy">
                        Shipping Address
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-gold hover:text-gold-dark"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-700">
                      <p className="font-semibold">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && (
                        <p>{shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{' '}
                        {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-playfair text-2xl font-bold text-navy">
                        Payment Method
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-gold hover:text-gold-dark"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700 font-semibold capitalize">
                      {paymentMethod === 'card'
                        ? 'Credit/Debit Card'
                        : paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : paymentMethod.toUpperCase()}
                    </p>
                  </div>

                  {/* Order Items Review */}
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                      Order Items
                    </h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const product = item.product;
                        const finalPrice =
                          product.price -
                          (product.price * (product.discount || 0)) / 100;

                        return (
                          <div
                            key={item._id}
                            className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0"
                          >
                            <img
                              src={product.images?.[0]?.url}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-navy">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${finalPrice.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold text-navy">
                              ${(finalPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 font-semibold hover:border-gold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-gold text-navy px-6 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-2xl font-bold text-navy">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiCheck className="text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCheck className="text-green-600" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCheck className="text-green-600" />
                    <span>Authentic products guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
