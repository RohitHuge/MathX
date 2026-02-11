import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Databases } from 'appwrite';
import { motion } from 'motion/react';
import { User, Mail, Phone, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../../config';
import GuestContestLayout from '../../layouts/GuestContestLayout';

// Appwrite init
const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);
const databases = new Databases(client);

export default function GuestStartPage() {
    const { contestId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contest, setContest] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // 1. Fetch contest details on mount
    useEffect(() => {
        const fetchContest = async () => {
            try {
                setLoading(true);
                const doc = await databases.getDocument(
                    appwriteDatabaseId,
                    'contest_info',
                    contestId
                );

                // CHECK AUTH REQUIREMENT
                // If auth_required is TRUE (default), redirect to standard login
                if (doc.auth_required !== false) {
                    // Redirect to standard contest page which handles login
                    window.location.href = `/contest/${contestId}`;
                    return;
                }

                setContest(doc);
            } catch (err) {
                console.error('Failed to fetch contest:', err);
                setError('Contest not found or not accessible.');
            } finally {
                setLoading(false);
            }
        };
        if (contestId) fetchContest();
    }, [contestId]);

    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid";
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = "Phone number must be 10 digits";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Save guest details to local storage and navigate to test environment
        // using a unique key composition
        const sessionKey = `guest_session_${contestId}`;
        const sessionData = {
            ...formData,
            contestId,
            startTime: new Date().toISOString()
        };

        localStorage.setItem(sessionKey, JSON.stringify(sessionData));

        // Navigate to the actual test page
        navigate(`/contest/guest/${contestId}/attempt`);
    };

    if (loading) {
        return (
            <GuestContestLayout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <Loader2 className="w-8 h-8 text-[#49E3FF] animate-spin mb-4" />
                    <p className="text-gray-400">Loading contest details...</p>
                </div>
            </GuestContestLayout>
        );
    }

    if (error) {
        return (
            <GuestContestLayout>
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Access Error</h2>
                    <p className="text-gray-400">{error}</p>
                    <button
                        onClick={() => navigate('/contest')}
                        className="mt-6 px-6 py-2 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition"
                    >
                        Back to Contests
                    </button>
                </div>
            </GuestContestLayout>
        );
    }

    return (
        <GuestContestLayout>
            <div className="max-w-md mx-auto mt-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
                    <p className="text-[#94A3B8]">{contest.description}</p>
                </div>

                <motion.div
                    className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <User className="w-5 h-5 mr-2 text-[#49E3FF]" />
                        Guest Registration
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                                <input
                                    type="text"
                                    className={`w-full bg-[#0F172A] border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#49E3FF] transition-colors ${validationErrors.name ? 'border-red-500' : 'border-[#334155]'}`}
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (validationErrors.name) setValidationErrors({ ...validationErrors, name: null });
                                    }}
                                />
                            </div>
                            {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                                <input
                                    type="email"
                                    className={`w-full bg-[#0F172A] border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#49E3FF] transition-colors ${validationErrors.email ? 'border-red-500' : 'border-[#334155]'}`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: null });
                                    }}
                                />
                            </div>
                            {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                                <input
                                    type="tel"
                                    className={`w-full bg-[#0F172A] border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#49E3FF] transition-colors ${validationErrors.phone ? 'border-red-500' : 'border-[#334155]'}`}
                                    placeholder="Enter your phone"
                                    value={formData.phone}
                                    onChange={e => {
                                        setFormData({ ...formData, phone: e.target.value });
                                        if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: null });
                                    }}
                                />
                            </div>
                            {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center group"
                            >
                                Start Contest
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs text-center text-[#64748B] mt-4">
                                By starting, you agree to our anti-cheating policy.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </GuestContestLayout>
    );
}
