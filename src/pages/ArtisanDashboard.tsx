import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useOrders } from '../contexts/OrderContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star,
  Eye,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

const ArtisanDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getProductsByArtisan, addProduct, updateProduct, deleteProduct } = useProducts();
  const { getAllOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'add-product'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    tags: '',
  });

  if (!user || user.role !== 'artisan') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be an artisan to access this page.</p>
        </div>
      </div>
    );
  }

  const artisanProducts = getProductsByArtisan(user.id);
  const allOrders = getAllOrders();
  const artisanOrders = allOrders.filter(order => 
    order.items.some(item => item.artisanId === user.id)
  );

  const totalRevenue = artisanOrders.reduce((sum, order) => {
    const artisanItems = order.items.filter(item => item.artisanId === user.id);
    return sum + artisanItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
  }, 0);

  const totalProducts = artisanProducts.length;
  const approvedProducts = artisanProducts.filter(p => p.status === 'approved').length;
  const pendingProducts = artisanProducts.filter(p => p.status === 'pending').length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      image: newProduct.image,
      category: newProduct.category,
      artisanId: user.id,
      artisanName: user.shopName || user.name,
      status: 'pending',
      stock: parseInt(newProduct.stock),
      tags: newProduct.tags.split(',').map(tag => tag.trim()),
      rating: 0,
      reviews: 0,
    });
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: '',
      tags: '',
    });
    setShowAddProduct(false);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      tags: product.tags.join(', '),
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image: newProduct.image,
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        tags: newProduct.tags.split(',').map(tag => tag.trim()),
      });
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: '',
        tags: '',
      });
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Artisan Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.shopName || user.name}!</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: DollarSign },
            { id: 'add-product', label: 'Add Product', icon: Plus },
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
              value={totalProducts}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Approved Products"
              value={approvedProducts}
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="Pending Approval"
              value={pendingProducts}
              icon={Clock}
              color="yellow"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="primary"
            />
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="flex items-center space-x-3">
              {user.verified ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">Verified Artisan</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-700">Verification Pending</span>
                </>
              )}
            </div>
            {!user.verified && (
              <p className="text-sm text-gray-600 mt-2">
                Your account is under review. You can add products, but they won't be visible to customers until approved.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisanProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
          
          <div className="space-y-4">
            {artisanOrders.map((order) => {
              const artisanItems = order.items.filter(item => item.artisanId === user.id);
              const orderTotal = artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {artisanItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Earnings</span>
                      <span className="font-bold text-primary-600">₹{orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add-product' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Product</h2>
          
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Textiles">Textiles</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Ceramics">Ceramics</option>
                <option value="Furniture">Furniture</option>
                <option value="Art">Art</option>
                <option value="Bags">Bags</option>
                <option value="Toys">Toys</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                required
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="handmade, traditional, wooden"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      category: '',
                      stock: '',
                      tags: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;