import React from 'react';
import { motion } from 'motion/react';

const ErrorModal = ({ isOpen, onClose, title = "Error", message, details }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#191D2A]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Error Title */}
        <h3 className="text-xl font-bold text-white mb-4">
          {title}
        </h3>
        
        {/* Error Message */}
        <p className="text-[#AEAEAE] mb-6 leading-relaxed">
          {message}
        </p>
        
        {/* Error Details (if provided) */}
        {details && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-300 text-sm font-mono">
              {details}
            </p>
          </div>
        )}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#191D2A]"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default ErrorModal;
