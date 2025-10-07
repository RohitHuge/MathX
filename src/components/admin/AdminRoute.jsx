import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { isUserAdmin } from '../../utils/adminUtils';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin privileges
  const isAdmin = isUserAdmin(user);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#191D2A] flex items-center justify-center p-4">
        <motion.div
          className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-[#AEAEAE] mb-6">
            You don't have permission to access the admin panel. Only administrators can manage contests and questions.
          </p>
          
          <div className="space-y-3">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-3 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/contests')}
              className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Contests
            </motion.button>
          </div>
          
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center space-x-2 text-[#AEAEAE] text-sm">
              <Shield className="w-4 h-4" />
              <span>Admin privileges required</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user is admin, render the children (admin content)
  return children;
};

export default AdminRoute;
