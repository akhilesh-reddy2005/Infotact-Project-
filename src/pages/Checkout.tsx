import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      // Create order
      const orderId = createOrder({
        userId: user.id,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          artisanId: item.artisanId,
          artisanName: item.artisanName,
        })),
        total: total + (total > 500 ? 0 : 50) + Math.round(total * 0.18),
        status: 'pending',
        shippingAddress: shippingInfo,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      });

      // Simulate payment process
      if (paymentMethod === 'online') {
        // In a real app, this would integrate with Razorpay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate('/orders', { state: { orderId } });
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total;
  const shipping = total > 500 ? 0 : 50;
  const tax = Math.round(total * 0.18);
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Shipping Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="cod"
                  name="payment"
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="online"
                  name="payment"
                  type="radio"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                  Online Payment (Razorpay)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Your payment information is secure and encrypted
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Place Order - ₹${grandTotal.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;