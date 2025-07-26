import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, ShoppingCart, Heart, Share2, Package, Shield, Truck, ArrowLeft } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      artisanId: product.artisanId,
      artisanName: product.artisanName,
    });

    // Show success message (you can implement a toast notification here)
    alert('Product added to cart!');
  };

  const images = [product.image]; // In a real app, you'd have multiple images

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-16 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-green-600 font-medium">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="text-3xl font-bold text-primary-600 mb-4">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="text-gray-600 mb-4">
              <span className="font-medium">Artisan:</span> {product.artisanName}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Product Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Handcrafted with traditional techniques</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Quality guaranteed</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Free shipping on orders over ₹500</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
            <div className="space-y-2 text-gray-600">
              <p>• Free shipping on orders over ₹500</p>
              <p>• Estimated delivery: 5-7 business days</p>
              <p>• 30-day return policy</p>
              <p>• Secure packaging for fragile items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would show related products based on category or tags */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;