import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Star, ArrowRight, Users, Package, Award, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.status === 'approved').slice(0, 6);

  const features = [
    {
      icon: Users,
      title: 'Supporting Artisans',
      description: 'Directly connect with skilled artisans and support their livelihoods'
    },
    {
      icon: Package,
      title: 'Authentic Products',
      description: 'Each product is handcrafted with traditional techniques and genuine materials'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every product goes through quality checks before reaching customers'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Safe and secure payment options with buyer protection'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FF6B35%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm18 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Authentic
              <span className="text-primary-600 block">Handmade Treasures</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect directly with skilled artisans and discover unique handcrafted products
              that tell stories of tradition, culture, and passion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Become an Artisan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Desi Etsy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to preserving traditional crafts while providing modern shopping experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional handcrafted items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      by {product.artisanName}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors group"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the beauty of authentic handcrafted products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Become an Artisan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;