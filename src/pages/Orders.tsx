import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Package, Truck, CheckCircle, Clock, X } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to view orders</h1>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const orders = getOrdersByUser(user.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'packed':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'packed':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            Start shopping to see your orders here
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      by {item.artisanName} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    Total: ₹{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Order Tracking</h4>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${
                  ['pending', 'confirmed', 'packed', 'shipped', 'delivered'].includes(order.status) 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    ['pending', 'confirmed', 'packed', 'shipped', 'delivered'].includes(order.status) 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm">Confirmed</span>
                </div>
                <div className={`w-8 h-0.5 ${
                  ['packed', 'shipped', 'delivered'].includes(order.status) 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center space-x-2 ${
                  ['packed', 'shipped', 'delivered'].includes(order.status) 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    ['packed', 'shipped', 'delivered'].includes(order.status) 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm">Packed</span>
                </div>
                <div className={`w-8 h-0.5 ${
                  ['shipped', 'delivered'].includes(order.status) 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center space-x-2 ${
                  ['shipped', 'delivered'].includes(order.status) 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    ['shipped', 'delivered'].includes(order.status) 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm">Shipped</span>
                </div>
                <div className={`w-8 h-0.5 ${
                  order.status === 'delivered' 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center space-x-2 ${
                  order.status === 'delivered' 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    order.status === 'delivered' 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;