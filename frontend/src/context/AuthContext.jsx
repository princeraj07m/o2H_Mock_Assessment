import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('task_manager_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('task_manager_token', res.data.token);
      localStorage.setItem('task_manager_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, files = {}) => {
    setLoading(true);
    try {
      const res = await authService.register(name, email, password, files);
      localStorage.setItem('task_manager_token', res.data.token);
      localStorage.setItem('task_manager_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData, files = {}) => {
    try {
      const res = await authService.updateProfile(profileData, files);
      localStorage.setItem('task_manager_user', JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
