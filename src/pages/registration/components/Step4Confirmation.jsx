import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Clock, MessageCircle } from 'lucide-react';

// Separate Print Component to break out of Framer Motion transforms
const PrintTicket = ({ formData, refId }) => {
    const teamLeader = formData.members?.[formData.leaderIndex] || {};

    return (
        <div id="print-portal-root" className="hidden print:block fixed inset-0 bg-white z-[9999] p-8">
            <style>
                {`
                @media print {
                    body {
                        visibility: hidden;
                    }
                    #print-portal-root {
                        visibility: visible;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        margin: 0;
                        padding: 20px;
                        background: white !important;
                        color: black !important;
                    }
                    #print-portal-root * {
                        visibility: visible;
                    }
                    /* Force black text for all children */
                    #print-portal-root p, 
                    #print-portal-root span, 
                    #print-portal-root h2, 
                    #print-portal-root div,
                    #print-portal-root li {
                        color: black !important;
                        text-shadow: none !important;
                        box-shadow: none !important;
                    }
                     /* Borders */
                    #print-portal-root .bg-gray-800,
                    #print-portal-root .border-gray-700 {
                         border-color: #000 !important;
                         border-width: 1px !important;
                    }
                }
                `}
            </style>

            <div className="max-w-2xl mx-auto border-2 border-black p-8 rounded-xl">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">MathX Registration</h1>
                        <p className="text-sm text-gray-600">Confirmation Ticket</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block bg-gray-100 border border-gray-300 px-3 py-1 rounded text-xs font-bold">
                            PENDING VERIFICATION
                        </span>
                    </div>
                </div>

                <div className="mb-8 border-b-2 border-black pb-8">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Team Name</p>
                    <h2 className="text-3xl font-bold">{formData.teamName}</h2>
                </div>

                <div className="mb-8">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                    <p className="text-xl font-mono tracking-widest">{refId}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Team Leader</p>
                        <p className="font-medium">{teamLeader.name}</p>
                        <p className="text-sm">{teamLeader.phone}</p>
                        <p className="text-sm">{teamLeader.email}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Institution</p>
                        <p className="font-medium">{teamLeader.college || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Team Members</p>
                    <ul className="space-y-2">
                        {formData.members?.map((m, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                                <span className="font-medium">{m.name}</span>
                                {i === formData.leaderIndex && <span className="text-xs bg-black text-white px-1.5 rounded ml-2">LEADER</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    <p>Designed and Developed by MathX Team</p>
                    <p className="mt-1">https://mathxpccoer.pages.dev</p>
                </div>
            </div>
        </div>
    );
};

const Step4Confirmation = ({ formData }) => {
    // Use real ID from formData, or fallback to mock if missing (dev mode)
    const refId = formData.refId || `MX-PENDING`;
    const teamLeader = formData.members?.[formData.leaderIndex] || {};
    // State to handle hydration/mounting for portal
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            {/* Render Print Portal */}
            {mounted && createPortal(
                <PrintTicket formData={formData} refId={refId} />,
                document.body
            )}

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-[#191D2A] p-10 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#49E3FF]/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A146D4]/30">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Registration Submitted!</h2>
                    <p className="text-gray-400 mb-8">
                        Your team <span className="text-[#49E3FF] font-semibold">{formData.teamName}</span> has been registered provided payment verification.
                    </p>

                    {/* On-Screen Ticket Layout */}
                    <div className="bg-[#0F1419] rounded-2xl p-6 border border-gray-700 text-left mb-8 relative">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Pending Verification
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference ID</p>
                            <p className="text-2xl font-mono text-white tracking-widest">{refId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Team Leader</p>
                                <p className="text-white font-medium">{teamLeader?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Contact</p>
                                <p className="text-white font-medium">{teamLeader?.phone || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Team Members</p>
                            <ul className="space-y-1">
                                {formData.members?.map((m, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                        {m.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 justify-center items-center">
                        <button
                            onClick={handleDownload}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Confirmation
                        </button>

                        <div className="w-full sm:w-auto bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-2">
                            <p className="text-green-400 text-sm mb-3 font-medium">
                                Join our WhatsApp group for further instructions and updates.
                            </p>
                            <a
                                href="https://chat.whatsapp.com/G8382yFa7B3At68nIWTYlx?mode=gi_t"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Join WhatsApp Group
                            </a>
                        </div>
                    </div>

                    <p className="mt-8 text-xs text-gray-500">
                        A confirmation email has been sent to {teamLeader?.email}.
                        <br />Credentials will be shared after successful payment verification.
                    </p>

                </div>
            </motion.div>
        </div>
    );
};

export default Step4Confirmation;
