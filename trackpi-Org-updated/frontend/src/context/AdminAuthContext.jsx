import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(() => {
    const stored = localStorage.getItem('adminInfo');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if admin session is still valid
  useEffect(() => {
    const checkAdminAuth = async () => {
      if (adminInfo) {
        try {
          // Test the session by making a request to a protected endpoint
          await axios.get('http://localhost:5000/api/admin', {
            withCredentials: true
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.log('Admin session expired');
          setAdminInfo(null);
          setIsAuthenticated(false);
          localStorage.removeItem('adminInfo');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, [adminInfo]);

  const login = (adminData) => {
    setAdminInfo(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAdminInfo(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminInfo');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      adminInfo, 
      isAuthenticated, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 