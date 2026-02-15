import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1419]/80 backdrop-blur-sm">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-gray-700 border-t-[#49E3FF] rounded-full mb-4"
                />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#49E3FF] font-medium text-lg tracking-wider"
                >
                    {text}
                </motion.p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-gray-600 border-t-[#49E3FF] rounded-full"
            />
            <span className="ml-3 text-gray-400 text-sm">{text}</span>
        </div>
    );
};

export default Loader;
