import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Account, ID } from 'appwrite';
import { appwriteEndpoint, appwriteProjectId } from '../../config.js';

// Appwrite configuration
const client = new Client()
  .setEndpoint(appwriteEndpoint) // Replace with your Appwrite endpoint
  .setProject(appwriteProjectId); // Replace with your Appwrite project ID

const account = new Account(client);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      // No active session
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
      return { success: true, user: currentUser };
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, rollno) => {
    try {
      setLoading(true);
      // const phone = `+91${inphone}`;
      console.log(phone);
      await account.create(ID.unique(), email, password, name, phone);
      // Auto-login after registration
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
      const promise = account.updatePrefs({
        phone: phone,
        rollno: rollno
      });
      if (promise) {
        return { success: true, user: currentUser };
      } else {
        return { success: false, message: 'Registration failed. Please try again.' };
      }
      
    } catch (error) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await account.createRecovery(email, 'https://your-domain.com/reset-password');
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    resetPassword,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
