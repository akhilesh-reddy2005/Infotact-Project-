import React, { createContext, useContext, useEffect, useState } from 'react';

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:5000/api'; // Make sure this matches your backend server port

interface User {
  id: string; // This will now be MongoDB's _id
  name: string;
  email: string;
  role: 'customer' | 'artisan' | 'admin';
  verified?: boolean;
  phone?: string;
  address?: string;
  shopName?: string;
  shopDescription?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>; // Changed to return Promise<boolean>
  isAuthenticated: boolean;
  getToken: () => string | null; // New method to get the token for other API calls
  fetchProtected: (url: string, options?: RequestInit) => Promise<any>; // Helper for protected calls
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // On initial load, try to get user and token from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('jwtToken');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Optionally, you could make a call to /api/auth/profile here
        // to validate the token and get the latest user data from the backend.
        // For simplicity, we're assuming the stored token/user is valid for now.
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        logout(); // Clear invalid data
      }
    }
  }, []);

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  // Helper function for making authenticated API calls
  const fetchProtected = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = getToken();
    if (!token) {
      console.error('No token found, user not authenticated.');
      logout(); // Force logout if no token
      throw new Error('Not authenticated');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // Default to JSON content type
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401 || response.status === 403) {
        // Token expired or unauthorized
        console.error('Authentication error:', response.statusText);
        logout(); // Log out user
        throw new Error('Session expired or unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('Error in fetchProtected:', error);
      throw error; // Re-throw to be caught by calling function
    }
  };


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, ...userWithoutToken } = data;
        setUser({ ...userWithoutToken, id: userWithoutToken._id }); // Map _id to id
        localStorage.setItem('currentUser', JSON.stringify({ ...userWithoutToken, id: userWithoutToken._id }));
        localStorage.setItem('jwtToken', token);
        return true;
      } else {
        console.error('Login failed:', data.message);
        // Optionally, show a user-friendly error message
        return false;
      }
    } catch (error) {
      console.error('Network error during login:', error);
      // Optionally, show a user-friendly error message
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, ...userWithoutToken } = data;
        setUser({ ...userWithoutToken, id: userWithoutToken._id }); // Map _id to id
        localStorage.setItem('currentUser', JSON.stringify({ ...userWithoutToken, id: userWithoutToken._id }));
        localStorage.setItem('jwtToken', token);
        return true;
      } else {
        console.error('Registration failed:', data.message);
        // Optionally, show a user-friendly error message
        return false;
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      // Optionally, show a user-friendly error message
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetchProtected(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      const data = await response; // fetchProtected already parses JSON

      // Backend returns updated user and potentially a new token
      const { token, ...updatedUserWithoutToken } = data;
      setUser({ ...updatedUserWithoutToken, id: updatedUserWithoutToken._id }); // Map _id to id
      localStorage.setItem('currentUser', JSON.stringify({ ...updatedUserWithoutToken, id: updatedUserWithoutToken._id }));
      if (token) {
        localStorage.setItem('jwtToken', token); // Update token if a new one is issued
      }
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Optionally, show a user-friendly error message
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      getToken,
      fetchProtected,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
