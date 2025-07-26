import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useOrders } from '../contexts/OrderContext';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  X, 
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { products, approveProduct, rejectProduct, deleteProduct } = useProducts();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'artisans'>('overview');

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const allOrders = getAllOrders();
  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your marketplace</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: DollarSign },
            { id: 'artisans', label: 'Artisans', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={products.length}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Pending Approvals"
              value={pendingProducts.length}
              icon={Clock}
              color="yellow"
            />
            <StatCard
              title="Total Orders"
              value={allOrders.length}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={TrendingUp}
              color="primary"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {allOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-primary-600">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
          
          {/* Pending Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Approvals ({pendingProducts.length})
            </h3>
            
            <div className="space-y-4">
              {pendingProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">by {product.artisanName}</p>
                    <p className="text-sm text-gray-600">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveProduct(product.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectProduct(product.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Products</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Artisan</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.artisanName}</td>
                      <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">#{order.id}</td>
                      <td className="py-3 px-4">{order.shippingAddress.name}</td>
                      <td className="py-3 px-4">₹{order.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Artisans Tab */}
      {activeTab === 'artisans' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Artisan Management</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">
              Artisan verification and management features would be implemented here.
              This would include artisan approval, profile management, and performance analytics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;