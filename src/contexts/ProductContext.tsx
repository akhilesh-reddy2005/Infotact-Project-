import { Search, Filter, Star, Grid, List, PackageIcon } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  artisanId: string;
  artisanName: string;
  status: 'pending' | 'approved' | 'rejected';
  stock: number;
  tags: string[];
  createdAt: string;
  rating: number;
  reviews: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByArtisan: (artisanId: string) => Product[];
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
  categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Silk Saree',
    description: 'Beautiful handwoven silk saree with traditional motifs',
    price: 8500,
    image: 'https://cdn.shopify.com/s/files/1/0281/2510/2153/products/saec1610-reda-traditional-paithani-woven-saree-in-art-silk-with-broad-border-and-bird-motifs-pallu.jpg?v=1678448276',
    category: 'Textiles',
    artisanId: '1', 
    artisanName: 'Meera Textiles',
    status: 'approved',
    stock: 5,
    tags: ['saree', 'silk', 'traditional', 'handwoven'],
    createdAt: '2024-01-15',
    rating: 4.8,
    reviews: 24
  },
  {
    id: '2',
    name: 'Brass Handicraft Vase',
    description: 'Intricately designed brass vase with floral patterns',
    price: 2200,
    image: 'https://m.media-amazon.com/images/I/81PYL2QAZEL._SL1500_.jpg',
    category: 'Home Decor',
    artisanId: '2',
    artisanName: 'Kumar Crafts',
    status: 'approved',
    stock: 8,
    tags: ['brass', 'vase', 'handicraft', 'home-decor'],
    createdAt: '2024-01-12',
    rating: 4.6,
    reviews: 18
  },
  {
    id: '3',
    name: 'Wooden Jewelry Box',
    description: 'Handcrafted wooden jewelry box with mirror',
    price: 1800,
    image: 'https://tse1.mm.bing.net/th/id/OIP.kKvVbp5Z3s5e17LHa47O0AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'Furniture',
    artisanId: '3',
    artisanName: 'Woodcraft Studio',
    status: 'approved',
    stock: 12,
    tags: ['wooden', 'jewelry-box', 'handcrafted', 'storage'],
    createdAt: '2024-01-10',
    rating: 4.9,
    reviews: 31
  },
  {
    id: '4',
    name: 'Ceramic Tea Set',
    description: 'Hand-painted ceramic tea set with traditional designs',
    price: 3200,
    image: 'https://i5.walmartimages.com/asr/f5b8b9a8-db74-46b3-8bab-d4d3750b991c_1.a324566a148730e0a24b1b82fc06a1f3.jpeg',
    category: 'Ceramics',
    artisanId: '4',
    artisanName: 'Pottery Paradise',
    status: 'approved',
    stock: 6,
    tags: ['ceramic', 'tea-set', 'hand-painted', 'traditional'],
    createdAt: '2024-01-08',
    rating: 4.7,
    reviews: 22
  },
  {
    id: '5',
    name: 'Embroidered Cushion Covers',
    description: 'Set of 4 embroidered cushion covers with mirror work',
    price: 1200,
    image: 'https://images.woodenstreet.de/image/data/eyda/embroidered-cotton-cushion-covers-set-of-2-blue18-x-18-inch/30-5/1.jpg',
    category: 'Textiles',
    artisanId: '5',
    artisanName: 'Thread Art',
    status: 'approved',
    stock: 15,
    tags: ['embroidered', 'cushion-covers', 'mirror-work', 'home-decor'],
    createdAt: '2024-01-05',
    rating: 4.5,
    reviews: 16
  },
  {
    id: '6',
    name: 'Silver Filigree Earrings',
    description: 'Delicate silver filigree earrings with traditional patterns',
    price: 2800,
    image: 'https://th.bing.com/th/id/OIP.sb8mbmc_BHHNh8tZSIzzOgHaIC?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'Jewelry',
    artisanId: '6',
    artisanName: 'Silver Creations',
    status: 'approved',
    stock: 20,
    tags: ['silver', 'filigree', 'earrings', 'jewelry'],
    createdAt: '2024-01-03',
    rating: 4.8,
    reviews: 27
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    setProducts(mockProducts);

  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByArtisan = (artisanId: string) => {
    return products.filter(product => product.artisanId === artisanId);
  };

  const approveProduct = (id: string) => {
    updateProduct(id, { status: 'approved' });
  };

  const rejectProduct = (id: string) => {
    updateProduct(id, { status: 'rejected' });
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByArtisan,
      approveProduct,
      rejectProduct,
      categories,
    }}>
      {children}
    </ProductContext.Provider>
  );
};