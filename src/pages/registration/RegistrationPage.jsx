import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import ProgressBar from './components/ui/ProgressBar';
import Step1Members from './components/Step1Members';
import Step2TeamDetails from './components/Step2TeamDetails';
import Step3Payment from './components/Step3Payment';
import Step4Confirmation from './components/Step4Confirmation';
import { submitRegistration } from './services/registrationService';
import { useToast } from './context/ToastContext';
import Loader from './components/ui/Loader';

const RegistrationContent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        members: [
            { name: '', email: '', phone: '', college: '' },
            { name: '', email: '', phone: '', college: '' },
            { name: '', email: '', phone: '', college: '' }
        ],
        teamName: '',
        leaderIndex: null,
        payment: {
            transactionId: '',
            screenshot: null,
            previewUrl: null
        }
    });

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('mathx_registration_form');
        const savedStep = localStorage.getItem('mathx_registration_step');

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // We can't easily restore the File object for screenshot, so we might lose it on reload.
                // That's acceptable for now, or we could handle base64.
                // For now, let's just restore text fields.
                setFormData(prev => ({
                    ...prev,
                    ...parsedData,
                    payment: { ...prev.payment, screenshot: null, previewUrl: null } // Reset file payment
                }));
            } catch (e) {
                console.error("Failed to parse saved registration data", e);
            }
        }

        if (savedStep) {
            setCurrentStep(parseInt(savedStep));
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        // Exclude large files/blobs from local storage to avoid quota limits
        const dataToSave = {
            ...formData,
            payment: {
                transactionId: formData.payment.transactionId,
                screenshot: null,
                previewUrl: null
            }
        };
        localStorage.setItem('mathx_registration_form', JSON.stringify(dataToSave));
        localStorage.setItem('mathx_registration_step', currentStep.toString());
    }, [formData, currentStep]);

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { error: toastError, success: toastSuccess } = useToast(); // Destructure toast methods
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitRegistrationHandler = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitRegistration(formData);
            if (result.success) {
                toastSuccess('Registration successful!');
                // Add refId to formData for Confirmation step to display
                setFormData(prev => ({ ...prev, refId: result.refId }));

                // Clear local storage
                localStorage.removeItem('mathx_registration_form');
                localStorage.removeItem('mathx_registration_step');

                nextStep();
            }
        } catch (error) {
            console.error(error);
            toastError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#191D2A] text-white relative overflow-hidden font-sans pb-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#A146D4]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-[#49E3FF]/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-2"
                    >
                        Team Registration
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400"
                    >
                        Join the ultimate mathematics competition. Register your team below.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs text-[#49E3FF] mt-2 font-medium tracking-wide"
                    >
                        Estimated time: 3–4 minutes
                    </motion.p>
                </header>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Content Area */}
                <div className="mt-8">
                    <AnimatePresence mode='wait'>
                        {currentStep === 1 && (
                            <Step1Members
                                key="step1"
                                formData={formData}
                                setFormData={setFormData}
                                onNext={nextStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2TeamDetails
                                key="step2"
                                formData={formData}
                                setFormData={setFormData}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Payment
                                key="step3"
                                formData={formData}
                                setFormData={setFormData}
                                onNext={submitRegistrationHandler}
                                onBack={prevStep}
                                isSubmitting={isSubmitting}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Confirmation
                                key="step4"
                                formData={formData}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {isSubmitting && <Loader fullScreen text="Submitting Registration..." />}
        </div>
    );
};

const RegistrationPage = () => {
    return (
        <ToastProvider>
            <RegistrationContent />
        </ToastProvider>
    );
};

export default RegistrationPage;
