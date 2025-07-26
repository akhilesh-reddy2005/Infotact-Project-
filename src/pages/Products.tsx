import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Search, Filter, Star, Grid, List } from 'lucide-react';
import { Package } from 'lucide-react';

const Products: React.FC = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.status === 'approved');

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">
          Discover authentic handcrafted products from skilled artisans
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Products Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group ${
            viewMode === 'list' ? 'flex' : ''
          }`}>
            <Link to={`/product/${product.id}`} className={viewMode === 'list' ? 'flex w-full' : ''}>
              <div className={`${
                viewMode === 'list' ? 'w-48 h-32' : 'aspect-w-16 aspect-h-12'
              } overflow-hidden flex-shrink-0`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                  } object-cover group-hover:scale-105 transition-transform duration-300`}
                />
              </div>
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-2">
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
                <p className="text-sm text-gray-500">
                  by {product.artisanName}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
           <Package className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;