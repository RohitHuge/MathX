import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { checkTeamNameAvailability } from '../services/registrationService';

const Step2TeamDetails = ({ formData, setFormData, onNext, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [teamNameAvailable, setTeamNameAvailable] = useState(null); // null, true, false
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const handleTeamNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({ ...prev, teamName: name }));
        setTeamNameAvailable(null); // Reset availability check on type
        if (errors.teamName) setErrors(prev => ({ ...prev, teamName: '' }));
    };

    const checkAvailability = async () => {
        if (!formData.teamName.trim()) return;

        setLoading(true);
        try {
            const isAvailable = await checkTeamNameAvailability(formData.teamName);
            setTeamNameAvailable(isAvailable);
            if (isAvailable) {
                toast.success('Team name is available!', 2000);
            } else {
                toast.error('Team name is already taken');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error checking availability');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaderChange = (e) => {
        setFormData(prev => ({ ...prev, leaderIndex: parseInt(e.target.value) }));
        if (errors.leaderIndex) setErrors(prev => ({ ...prev, leaderIndex: '' }));
    };

    const handleContinue = () => {
        const newErrors = {};
        if (!formData.teamName.trim()) newErrors.teamName = 'Team Name is required';
        if (formData.leaderIndex === null || formData.leaderIndex === undefined) newErrors.leaderIndex = 'Please select a Team Leader';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (teamNameAvailable === false) {
                toast.error('Team name is taken, please choose another.');
                return;
            }
            onNext();
        } else {
            toast.error('Please fill in all team details.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Team Details</h2>
                <span className="text-gray-400 text-sm">Step 2/4</span>
            </div>

            <div className="bg-[#191D2A] p-8 rounded-2xl border border-gray-700/50 shadow-xl space-y-6">

                {/* Team Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            value={formData.teamName}
                            onChange={handleTeamNameChange}
                            onBlur={checkAvailability}
                            className={`w-full bg-[#0F1419] border ${errors.teamName ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-[#49E3FF] transition-colors`}
                            placeholder="The Math Magicians"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {loading ? (
                                <Loader2 className="w-5 h-5 text-[#49E3FF] animate-spin" />
                            ) : teamNameAvailable ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : null}
                        </div>
                    </div>
                    {errors.teamName && <p className="text-red-400 text-xs mt-1">{errors.teamName}</p>}
                </div>

                {/* Team Leader Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Select Team Leader</label>
                    <div className="relative">
                        <Crown className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                        <select
                            value={formData.leaderIndex === null ? '' : formData.leaderIndex}
                            onChange={handleLeaderChange}
                            className={`w-full bg-[#0F1419] border ${errors.leaderIndex ? 'border-red-500' : 'border-gray-700'} rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-[#49E3FF] cursor-pointer`}
                        >
                            <option value="" disabled>Choose a leader...</option>
                            {formData.members.map((member, idx) => (
                                <option key={idx} value={idx}>
                                    {member.name || `Member ${idx + 1}`}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">The leader will be the primary point of contact.</p>
                    {errors.leaderIndex && <p className="text-red-400 text-xs mt-1">{errors.leaderIndex}</p>}
                </div>

            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-600 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(73,227,255,0.4)] transform hover:scale-105 transition-all"
                >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default Step2TeamDetails;
