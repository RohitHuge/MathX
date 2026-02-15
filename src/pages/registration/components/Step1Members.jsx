import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, School, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Step1Members = ({ formData, setFormData, onNext }) => {
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
    const [localMember, setLocalMember] = useState(formData.members[0]);
    const [copyCollege, setCopyCollege] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        // When switching members or mounting, load the data from formData
        setLocalMember(formData.members[currentMemberIndex]);

        // Reset copy college checkbox for new members (2 and 3)
        if (currentMemberIndex > 0) {
            setCopyCollege(false);
        }
    }, [currentMemberIndex, formData.members]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalMember(prev => ({ ...prev, [name]: value }));
        // Clear error on type
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleCopyCollege = (e) => {
        const isChecked = e.target.checked;
        setCopyCollege(isChecked);

        if (isChecked && currentMemberIndex > 0) {
            const firstMemberCollege = formData.members[0].college;
            setLocalMember(prev => ({ ...prev, college: firstMemberCollege }));
        } else if (!isChecked) {
            setLocalMember(prev => ({ ...prev, college: '' }));
        }
    };

    const validateCurrentMember = () => {
        const newErrors = {};
        if (!localMember.name.trim()) newErrors.name = 'Full Name is required';

        if (!localMember.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localMember.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!localMember.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(localMember.phone)) {
            newErrors.phone = 'Phone must be 10 digits';
        }

        if (!localMember.college.trim()) newErrors.college = 'College Name is required';

        // Duplicate checks against ALREADY SAVED members
        const currentEmail = localMember.email.toLowerCase();
        const currentPhone = localMember.phone;

        formData.members.forEach((m, idx) => {
            if (idx < currentMemberIndex) {
                if (m.email.toLowerCase() === currentEmail) {
                    newErrors.email = 'This email is already used by another member';
                }
                if (m.phone === currentPhone) {
                    newErrors.phone = 'This phone is already used by another member';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveAndNext = () => {
        if (!validateCurrentMember()) {
            toast.error('Please fix the errors before proceeding', 3000);
            return;
        }

        // Save current member to formData
        const updatedMembers = [...formData.members];
        updatedMembers[currentMemberIndex] = localMember;
        setFormData(prev => ({ ...prev, members: updatedMembers }));

        toast.success(`Member ${currentMemberIndex + 1} saved!`, 2000);

        if (currentMemberIndex < 2) {
            setCurrentMemberIndex(prev => prev + 1);
        } else {
            onNext();
        }
    };

    const handleBack = () => {
        if (currentMemberIndex > 0) {
            // Save current state before going back just in case
            const updatedMembers = [...formData.members];
            updatedMembers[currentMemberIndex] = localMember;
            setFormData(prev => ({ ...prev, members: updatedMembers }));

            setCurrentMemberIndex(prev => prev - 1);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Member {currentMemberIndex + 1} of 3
                </h2>
                <span className="text-gray-400 text-sm">Step 1/4</span>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentMemberIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#191D2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl"
                >
                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={localMember.name}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0F1419] border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#A146D4] transition-colors`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={localMember.email}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0F1419] border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#A146D4] transition-colors`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={localMember.phone}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className={`w-full bg-[#0F1419] border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#A146D4] transition-colors`}
                                    placeholder="9876543210"
                                />
                            </div>
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* College */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-400">College Name</label>
                                {currentMemberIndex > 0 && (
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={copyCollege}
                                            onChange={handleCopyCollege}
                                            className="w-4 h-4 rounded border-gray-600 text-[#A146D4] focus:ring-[#A146D4] bg-[#0F1419]"
                                        />
                                        <span className="text-xs text-[#49E3FF] group-hover:underline">Same as Member 1</span>
                                    </label>
                                )}
                            </div>
                            <div className="relative">
                                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="college"
                                    value={localMember.college}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0F1419] border ${errors.college ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#A146D4] transition-colors`}
                                    placeholder="XYZ College of Engineering"
                                />
                            </div>
                            {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college}</p>}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    disabled={currentMemberIndex === 0}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${currentMemberIndex === 0
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Previous Member
                </button>

                <button
                    onClick={handleSaveAndNext}
                    className="px-8 py-3 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(161,70,212,0.4)] transform hover:scale-105 transition-all"
                >
                    {currentMemberIndex === 2 ? 'Continue to Team Details' : 'Save & Next Member'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Step1Members;
