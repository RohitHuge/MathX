import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/auth/Loader';
import ErrorModal from '../../components/auth/ErrorModal';
import Toast from '../../components/auth/Toast';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollno: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'register' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (activeTab === 'register' && !formData.rollno.trim()) {
      newErrors.rollno = 'Roll number is required';
    }

    if (activeTab === 'register' && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (activeTab === 'register' && !/^\S+@pccoer\.in$/i.test(formData.email)) {
      newErrors.email = 'Please use your college email (@pccoer.in)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
        showToast('success', 'Welcome back! Redirecting to dashboard...');
        setTimeout(() => navigate('/contest'), 1500);
      } else {
        
       const  res = await register(formData.name, formData.email, formData.password, formData.phone, formData.rollno);
        if (res.success) {
        showToast('success', 'Account created successfully! Welcome to MathX!');
          setTimeout(() => navigate('/contest'), 1500);
        } else {
          showErrorModal('Registration Error', res.message);
        }
      }
    } catch (error) {
      showErrorModal('Authentication Error', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email first' }));
      return;
    }

    try {
      const { resetPassword } = useAuth();
      await resetPassword(formData.email);
      showToast('success', 'Password reset email sent! Check your inbox.');
    } catch (error) {
      showErrorModal('Password Reset Error', error.message);
    }
  };

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  const showErrorModal = (title, message) => {
    setErrorModal({ isOpen: true, title, message });
  };

  const closeErrorModal = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#191D2A] flex items-center justify-center px-4 py-12 relative">
      {/* Back to Home Button - Top Left */}
      <Link 
        to="/contest" 
        className="absolute top-6 left-6 text-[#AEAEAE] hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 z-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>

      {/* Background Math Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-[#A146D4]/10 font-bold">∑</div>
        <div className="absolute top-40 right-20 text-4xl text-[#49E3FF]/10 font-bold">∫</div>
        <div className="absolute bottom-40 left-20 text-5xl text-[#A146D4]/10 font-bold">π</div>
        <div className="absolute bottom-20 right-10 text-6xl text-[#49E3FF]/10 font-bold">∞</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-[#A146D4]/10 font-bold">√</div>
        <div className="absolute top-1/3 right-1/3 text-4xl text-[#49E3FF]/10 font-bold">∂</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              MathX
            </motion.div>
          </Link>
        </div>

        {/* Auth Card */}
        <motion.div
          className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tab Toggle */}
          <div className="flex mb-8 bg-white/5 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-[#A146D4] text-white shadow-lg'
                  : 'text-[#AEAEAE] hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-[#A146D4] text-white shadow-lg'
                  : 'text-[#AEAEAE] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab}
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Full Name (Register only) */}
              {activeTab === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#A146D4] transition-all duration-200 ${
                      errors.name ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Roll Number (Register only) */}
              {activeTab === 'register' && (
                <div>
                  <label htmlFor="rollno" className="block text-sm font-medium text-white mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollno"
                    name="rollno"
                    value={formData.rollno}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#A146D4] transition-all duration-200 ${
                      errors.rollno ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="FECOMPE60"
                  />
                  {errors.rollno && (
                    <p className="mt-1 text-sm text-red-400">{errors.rollno}</p>
                  )}
                </div>
              )}

              {/* Phone Number (Register only) */}

              {activeTab === 'register' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}

                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#A146D4] transition-all duration-200 ${
                      errors.phone ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Enter your phone number (10 digits)"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#A146D4] transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder={activeTab === 'register' ? 'Enter your college email (@pccoer.in)' : 'Enter your email'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#A146D4] transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password (Login only) */}
              {activeTab === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#49E3FF] hover:text-white transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-3 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:ring-offset-2 focus:ring-offset-[#191D2A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Register'}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#AEAEAE]">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-[#49E3FF] hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#49E3FF] hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Global Components */}
      {loading && <Loader />}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default AuthPage;
