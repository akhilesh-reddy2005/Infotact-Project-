import React, { createContext, useContext, useEffect, useState } from 'react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisanId: string;
  artisanName: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updatePaymentStatus: (id: string, status: Order['paymentStatus']) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
      )
    );
  };

  const updatePaymentStatus = (id: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, paymentStatus, updatedAt: new Date().toISOString() } : order
      )
    );
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      updatePaymentStatus,
      getOrderById,
      getOrdersByUser,
      getAllOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
};