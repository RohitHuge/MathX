import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Client, Databases, ID } from 'appwrite';
import { appwriteProjectId, appwriteDatabaseId, appwriteFormId, appwriteEndpoint } from '../../config';

// Contact Information Cards Component
function ContactInfo() {
  const contactMethods = [
    {
      id: 1,
      icon: "💬",
      title: "WhatsApp Community",
      value: "Join Our Community",
      link: "https://chat.whatsapp.com/IR5h08SJL3qDFjwvazgFA5?mode=ems_qr_t", // Replace with actual WhatsApp community link
      description: "Join our WhatsApp community for instant updates and discussions"
    },
    {
      id: 2,
      icon: "📷",
      title: "Instagram",
      value: "@mathxpccoer",
      link: "https://instagram.com/mathxpccoer",
      description: "Follow us for updates and announcements"
    },
    {
      id: 3,
      icon: "📍",
      title: "Location",
      value: "Pimpri Chinchwad College Of Engineering & Research, Ravet, Pimpri-Chinchwad, Maharashtra 41210",
      link: "https://maps.app.goo.gl/TZc4uUmnUPNzuhhr5",
      description: "Trace our location on Google Maps"
    }
  ];

  return (
    <section className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/30 to-[#191D2A]/50"></div>
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-[#191D2A]/70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-44 h-44 bg-[#191D2A]/60 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll">
          Club Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div 
              key={method.id} 
              className="group relative p-8 border border-[#A146D4]/30 rounded-xl bg-[#191D2A] hover:border-[#49E3FF] transition-all duration-500 hover:shadow-lg hover:shadow-[#49E3FF]/20 hover:scale-105 transform animate-on-scroll cursor-pointer" 
              data-delay={index * 200}
              onClick={() => method.link && window.open(method.link, '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A146D4]/5 to-[#49E3FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-[#A146D4]/80 to-[#49E3FF]/80 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#49E3FF] transition-colors duration-300">
                  {method.title}
                </h3>
                
                <div className="mb-4">
                  {method.link ? (
                    <a 
                      href={method.link}
                      className="text-[#49E3FF] font-semibold text-lg hover:underline transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-[#49E3FF] font-semibold text-lg">
                      {method.value}
                    </p>
                  )}
                </div>
                
                <p className="text-[#AEAEAE] leading-relaxed">
                  {method.description}
                </p>
                
                {method.link && (
                  <div className="mt-4">
                    <p className="text-[#49E3FF] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to {method.title === 'WhatsApp Community' ? 'join community' : method.title === 'Email' ? 'send email' : 'visit profile'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Join Us Form Component
function JoinForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (successMessage || errorMessage) {
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call (replace with actual Appwrite API call)
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

      const database = new Databases(client);

      const response = await database.createDocument(appwriteDatabaseId, appwriteFormId, ID.unique(), {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      if (response) {
        setSuccessMessage('Thank you for joining MathX! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      }
      else {
        setErrorMessage('Something went wrong, please try again.');
      }
      
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Something went wrong, please try again.' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#A146D4]/20 via-[#191D2A] to-[#49E3FF]/20 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/20 to-[#191D2A]/40"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#A146D4]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-[#49E3FF]/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 animate-on-scroll">
          Join Us
        </h2>
        
        <div className="bg-[#191D2A]/80 border border-[#A146D4]/30 rounded-xl p-8 md:p-12 animate-on-scroll" data-delay="200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#49E3FF] mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#191D2A] border border-[#A146D4]/30 rounded-lg text-white placeholder-[#AEAEAE]/50 focus:border-[#49E3FF] focus:ring-2 focus:ring-[#49E3FF]/20 focus:outline-none transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#49E3FF] mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#191D2A] border border-[#A146D4]/30 rounded-lg text-white placeholder-[#AEAEAE]/50 focus:border-[#49E3FF] focus:ring-2 focus:ring-[#49E3FF]/20 focus:outline-none transition-all duration-300"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#49E3FF] mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 bg-[#191D2A] border border-[#A146D4]/30 rounded-lg text-white placeholder-[#AEAEAE]/50 focus:border-[#49E3FF] focus:ring-2 focus:ring-[#49E3FF]/20 focus:outline-none transition-all duration-300 resize-none"
                placeholder="Why would you like to join MathX?"
                required
              />
            </div>
            
            {/* Messages */}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 animate-in slide-in-from-bottom-4">
                <p className="text-green-400 font-medium text-center">
                  {successMessage}
                </p>
              </div>
            )}
            
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 animate-in slide-in-from-bottom-4">
                <p className="text-red-400 font-medium text-center">
                  {errorMessage}
                </p>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
              
              {(successMessage || formData.name || formData.email || formData.message) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border-2 border-[#A146D4]/80 text-[#A146D4] px-8 py-3 rounded-lg font-semibold hover:bg-[#A146D4] hover:text-white transition-all duration-300 hover:scale-105 transform"
                >
                  Reset Form
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative text-white py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A146D4]/60 via-[#191D2A] to-[#49E3FF]/60"></div>
      
      {/* Background Math Symbols */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">∑</div>
        <div className="absolute top-32 right-20 text-5xl">∫</div>
        <div className="absolute bottom-20 left-20 text-4xl">π</div>
        <div className="absolute bottom-32 right-10 text-5xl">∞</div>
        <div className="absolute top-1/2 left-1/3 text-3xl">√</div>
        <div className="absolute top-1/3 right-1/3 text-4xl">∂</div>
        
        {/* Additional Math Symbols */}
        <div className="absolute top-16 left-1/4 text-5xl">∑</div>
        <div className="absolute top-40 right-1/4 text-4xl">∫</div>
        <div className="absolute bottom-16 right-1/3 text-5xl">π</div>
        <div className="absolute bottom-40 left-1/3 text-4xl">∞</div>
        <div className="absolute top-1/4 right-16 text-3xl">√</div>
        <div className="absolute top-3/4 left-16 text-4xl">∂</div>
      </div>
      
      {/* Dark Center Element */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/40 to-[#191D2A]/80"></div>
      
      {/* Floating Dark Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#191D2A]/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#191D2A]/40 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#191D2A]/50 rounded-full blur-lg"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-on-scroll">
          Get in Touch
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90 font-medium animate-on-scroll" data-delay="200">
          We'd love to hear from you
        </p>
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-on-scroll" data-delay="400">
          Whether it's a question, collaboration, or to join MathX — we're here to help you discover the X Factor of Maths.
        </p>
      </div>
    </section>
  );
}

// Main Contact Component
export default function Contact() {
  useEffect(() => {
    document.title = "MathX Contact | Get in Touch";
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-[#191D2A] font-display min-h-screen">
      <Header />
      <HeroSection />
      <ContactInfo />
      <JoinForm />
      <Footer />
    </div>
  );
}
