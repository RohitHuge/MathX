import React from 'react';
import { motion } from 'motion/react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-[#191D2A] border border-[#A146D4]/30 rounded-2xl p-8 flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spinner */}
        <motion.div
          className="w-12 h-12 border-4 border-[#A146D4]/30 border-t-[#A146D4] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Loading Text */}
        <motion.p
          className="text-white text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Processing...
        </motion.p>
        
        {/* Subtitle */}
        <motion.p
          className="text-[#AEAEAE] text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Please wait while we authenticate your request
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;
