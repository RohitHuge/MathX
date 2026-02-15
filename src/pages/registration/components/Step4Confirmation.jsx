import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Clock } from 'lucide-react';

const Step4Confirmation = ({ formData }) => {
    // Use real ID from formData, or fallback to mock if missing (dev mode)
    const refId = formData.refId || `MX-PENDING`;
    const teamLeader = formData.members[formData.leaderIndex];
    const ticketRef = useRef(null);

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center print:w-full print:max-w-none">
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #confirmation-ticket, #confirmation-ticket * {
                        visibility: visible;
                    }
                    #confirmation-ticket {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: black;
                        border: none;
                        box-shadow: none;
                    }
                    /* Adjust colors for print */
                    #confirmation-ticket p, #confirmation-ticket span, #confirmation-ticket h2 {
                        color: black !important;
                    }
                    #confirmation-ticket .bg-gray-800 {
                         border-top: 1px solid #ddd;
                    }
                }
                `}
            </style>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-[#191D2A] p-10 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:p-0 print:bg-white"
            >
                {/* Background Glow - Hide on Print */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#49E3FF]/20 blur-[100px] rounded-full pointer-events-none print:hidden" />

                <div className="relative z-10" id="confirmation-ticket">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#A146D4]/30 print:hidden">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 print:text-black">Registration Submitted!</h2>
                    <p className="text-gray-400 mb-8 print:text-black">
                        Your team <span className="text-[#49E3FF] font-semibold print:text-black print:font-bold">{formData.teamName}</span> has been registered provided payment verification.
                    </p>

                    {/* Ticket / ID Card Look */}
                    <div className="bg-[#0F1419] rounded-2xl p-6 border border-gray-700 text-left mb-8 relative print:bg-white print:border-2 print:border-black">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1 print:border-black print:text-black">
                                <Clock className="w-3 h-3" /> Pending Verification
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-black">Reference ID</p>
                            <p className="text-2xl font-mono text-white tracking-widest print:text-black">{refId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-black">Team Leader</p>
                                <p className="text-white font-medium print:text-black">{teamLeader.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-black">Contact</p>
                                <p className="text-white font-medium print:text-black">{teamLeader.phone}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-4 print:border-gray-300">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 print:text-black">Team Members</p>
                            <ul className="space-y-1">
                                {formData.members.map((m, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2 print:text-black">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 print:bg-black" />
                                        {m.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center print:hidden">
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Confirmation
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-gray-500 print:hidden">
                        A confirmation email has been sent to {teamLeader.email}.
                        <br />Credentials will be shared after successful payment verification.
                    </p>

                </div>
            </motion.div>
        </div>
    );
};

export default Step4Confirmation;
