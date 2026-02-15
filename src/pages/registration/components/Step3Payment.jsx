import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Upload, Check, Copy, AlertCircle, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Loader from './ui/Loader';

const Step3Payment = ({ formData, setFormData, onNext, onBack, isSubmitting }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    // Constants
    const UPI_ID = "mathx-club@upi";
    const AMOUNT = "₹150";

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(UPI_ID);
        toast.success('UPI ID copied to clipboard!', 2000);
    };

    const processFile = (file) => {
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed (JPG, PNG)', 3000);
            return;
        }

        // Validate size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB', 3000);
            return;
        }

        setUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            // Create local preview URL
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    screenshot: file,
                    previewUrl: previewUrl
                }
            }));
            setUploading(false);
            toast.success('Screenshot uploaded successfully!', 2000);
        }, 1500);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({
            ...prev,
            payment: { ...prev.payment, screenshot: null, previewUrl: null }
        }));
    };

    const handleSubmit = () => {
        if (!formData.payment.screenshot && !formData.payment.transactionId) {
            // Allow either screenshot OR transaction ID for flexibility, or enforce screenshot as per prompt
            // Prompt says "Upload screenshot below". I'll enforce screenshot.
            if (!formData.payment.screenshot) {
                toast.error('Please upload potential payment screenshot');
                return;
            }
        }
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            {/* Left Column: Payment Details */}
            <div className="bg-[#191D2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-white mb-4">Scan & Pay</h3>

                {/* QR Code Placeholder */}
                <div className="bg-white p-4 rounded-xl mb-6 shadow-inner">
                    {/* Replace this with actual QR Image later using <img src="..." /> */}
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                        <QrCode className="w-16 h-16 text-gray-500" />
                        <span className="sr-only">QR Code</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <div className="bg-[#0F1419] p-4 rounded-xl border border-gray-700 flex justify-between items-center group relative overflow-hidden">
                        <div className="text-left z-10">
                            <p className="text-xs text-gray-400">UPI ID</p>
                            <p className="text-[#49E3FF] font-mono font-bold tracking-wide">{UPI_ID}</p>
                        </div>
                        <button
                            onClick={handleCopyUPI}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors z-10 text-gray-400 hover:text-white"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </div>

                    <div className="bg-[#0F1419] p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                        <div className="text-left">
                            <p className="text-xs text-gray-400">Amount to Pay</p>
                            <p className="text-white font-bold text-xl">{AMOUNT}</p>
                        </div>
                        <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/20">
                            Verified Amount
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-left">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-200">
                        Scanning allows instant verification. Please ensure the transaction is successful before uploading.
                    </p>
                </div>
            </div>

            {/* Right Column: Upload Section */}
            <div className="flex flex-col">
                <div className="bg-[#191D2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">Upload Proof</h3>
                    <p className="text-gray-400 text-sm mb-6">Upload a screenshot of your payment confirmation.</p>

                    {!formData.payment.screenshot ? (
                        <div
                            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${isDragging
                                ? 'border-[#49E3FF] bg-[#49E3FF]/5'
                                : 'border-gray-600 hover:border-gray-500 bg-[#0F1419]'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {uploading ? (
                                <Loader text="Processing image..." />
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-[#A146D4]" />
                                    </div>
                                    <p className="text-white font-medium mb-2">Drag & drop or Click to Upload</p>
                                    <p className="text-gray-500 text-xs text-center max-w-[200px]">
                                        Supported formats: JPG, PNG. Max size: 2MB.
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                                    >
                                        Select File
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 bg-[#0F1419] rounded-xl border border-gray-700 overflow-hidden relative group">
                            <img
                                src={formData.payment.previewUrl}
                                alt="Payment Screenshot"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all transform hover:scale-110 border border-red-500/50"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                                <Check className="w-3 h-3" /> Uploaded
                            </div>
                        </div>
                    )}

                    {/* Optional Transaction ID field */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Transaction ID (Optional)</label>
                        <input
                            type="text"
                            value={formData.payment.transactionId || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, transactionId: e.target.value } }))}
                            className="w-full bg-[#0F1419] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#49E3FF] transition-colors"
                            placeholder="Enter UTR / Ref No."
                        />
                    </div>
                </div>

                {/* Navigation Buttons for this step */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-600 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-8 py-3 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-bold rounded-xl flex items-center gap-2 transform transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(73,227,255,0.4)] hover:scale-105'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Step3Payment;
