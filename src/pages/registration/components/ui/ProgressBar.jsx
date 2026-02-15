import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
    { id: 1, label: 'Members' },
    { id: 2, label: 'Team' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Done' }
];

const ProgressBar = ({ currentStep }) => {
    // Calculate progress percentage for the bar background
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full mb-10">
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full z-0" />

                {/* Animated Progress Line */}
                <motion.div
                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] -translate-y-1/2 rounded-full z-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />

                {/* Steps */}
                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center relative">
                                <motion.div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 font-bold text-sm bg-[#191D2A] z-10
                    ${isActive
                                            ? 'border-[#49E3FF] text-[#49E3FF] shadow-[0_0_15px_rgba(73,227,255,0.3)]'
                                            : isCompleted
                                                ? 'border-[#A146D4] bg-[#A146D4] text-white border-transparent'
                                                : 'border-gray-700 bg-[#0F1419] text-gray-500'
                                        }`}
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                    }}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                                </motion.div>
                                <div
                                    className={`absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${isActive ? 'text-[#49E3FF]' : isCompleted ? 'text-gray-300' : 'text-gray-600'
                                        }`}
                                >
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
