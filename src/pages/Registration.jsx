import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Databases, ID } from 'appwrite';
import { appwriteProjectId, appwriteDatabaseId, appwriteRegistrationFormId, appwriteEndpoint } from '../../config';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    rollNo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation functions
  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateRollNo = (rollNo) => {
    const rollNoRegex = /^[A-Z]{2}[A-Z]{4}[A-Z]\d{2}$/;
    return rollNoRegex.test(rollNo);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate roll number
    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required';
    } else if (!validateRollNo(formData.rollNo.toUpperCase())) {
      newErrors.rollNo = 'Roll number must be in format FECOMPE42 (First 2 letters: year, next 4: branch, next 1: division, last 2: roll number)';
    }

    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      try {
        const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);
        const database = new Databases(client);

        const response = await database.createDocument(
          appwriteDatabaseId, 
          appwriteRegistrationFormId, 
          ID.unique(), 
          {
            name: formData.name,
            mobileNo : formData.mobile,
            email: formData.email,
            rollNo: formData.rollNo.toUpperCase()
          }
        );

        if (response) {
          setSuccessMessage('Registration successful! Welcome to MathX Club!');
          setFormData({ name: '', mobile: '', email: '', rollNo: '' });
          
          // Navigate back to links page after 3 seconds
          setTimeout(() => {
            navigate('/links');
          }, 3000);
        } else {
          setErrorMessage('Something went wrong, please try again.');
        }
      } catch (error) {
        console.error('Error submitting registration:', error);
        setErrorMessage('Something went wrong, please try again. ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToLinks = () => {
    navigate('/links');
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ backgroundColor: '#191D2A' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToLinks}
            className="mb-4 text-[#49E3FF] hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Links
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">MathX Registration</h1>
          <p className="text-gray-400">Join our math community</p>
        </div>

        {/* Registration Form */}
        <div className="bg-[#191D2A] rounded-2xl p-6 relative">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#A146D4] to-[#49E3FF] p-[2px]">
            <div className="w-full h-full rounded-2xl bg-[#191D2A]" />
          </div>
          
          {/* Content */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:border-transparent transition-all"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobile && (
                  <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Roll Number Field */}
              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-300 mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:border-transparent transition-all uppercase"
                  placeholder="FECOMPE42 (F: First Year, E: Engineering, COMP: Computer, E: Division, 42: Roll No.)"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.rollNo && (
                  <p className="text-red-400 text-xs mt-1">{errors.rollNo}</p>
                )}
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-medium text-center text-sm">
                    {successMessage}
                  </p>
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-medium text-center text-sm">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white font-semibold rounded-lg hover:from-[#8B3BB8] hover:to-[#3BC8E8] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#A146D4] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
