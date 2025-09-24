import React, { useEffect } from 'react';
import { motion } from 'motion/react';

const Toast = ({ isVisible, onClose, type = 'success', title, message, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/10 to-green-600/10',
          border: 'border-green-500/30',
          icon: (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-green-500/20'
        };
      case 'error':
        return {
          bg: 'from-red-500/10 to-red-600/10',
          border: 'border-red-500/30',
          icon: (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-red-500/20'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/10 to-yellow-600/10',
          border: 'border-yellow-500/30',
          icon: (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-yellow-500/20'
        };
      case 'info':
        return {
          bg: 'from-blue-500/10 to-blue-600/10',
          border: 'border-blue-500/30',
          icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-blue-500/20'
        };
      default:
        return {
          bg: 'from-[#A146D4]/10 to-[#49E3FF]/10',
          border: 'border-[#A146D4]/30',
          icon: (
            <svg className="w-6 h-6 text-[#49E3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-[#A146D4]/20'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`bg-gradient-to-br ${styles.bg} border ${styles.border} rounded-2xl p-4 backdrop-blur-sm shadow-lg`}>
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`w-8 h-8 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {styles.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-white font-semibold text-sm mb-1">
                {title}
              </h4>
            )}
            <p className="text-[#AEAEAE] text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-[#AEAEAE] hover:text-white transition-colors duration-200 flex-shrink-0"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;
