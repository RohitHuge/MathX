import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Maximize2,
    Minimize2,
    AlertTriangle
} from 'lucide-react';

const GuestContestLayout = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Basic fullscreen detection
    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#49E3FF]/30">
            {/* Minimal Header */}
            <header className="h-16 border-b border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                            MathX
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#49E3FF]/10 text-[#49E3FF] border border-[#49E3FF]/20">
                            Guest Mode
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Status indicators can go here */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Simple Footer */}
            <footer className="text-center text-[#64748B] text-sm pb-6">
                <p>&copy; {new Date().getFullYear()} MathX Contest Platform</p>
            </footer>
        </div>
    );
};

export default GuestContestLayout;
