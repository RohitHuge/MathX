import React from 'react';
import { motion } from 'framer-motion';

const RegistrationPage = () => {
    return (
        <div className="min-h-screen bg-[#191D2A] text-white relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#A146D4]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-[#49E3FF]/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px]" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 text-center shadow-2xl"
                >
                    <p className="text-sm uppercase tracking-[0.35em] text-[#49E3FF] mb-4">
                        Showcase Update
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4">
                        Registration Closed
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300">
                        Showcase registration is closed.
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                        Better luck next time!
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RegistrationPage;
