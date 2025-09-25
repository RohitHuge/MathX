import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LinksPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  // Set target date for countdown: October 1, 2025 at 3 PM
  const targetDate = useMemo(() => {
    return new Date('2025-10-01T15:00:00');
  }, []); // Only calculate once when component mounts

  useEffect(() => {
    // Initial calculation
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const newTimeLeft = {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
        setTimeLeft(newTimeLeft);
        return true;
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }
    };
    
    // Set initial time
    calculateTimeLeft();
    
    const timer = setInterval(() => {
      const shouldContinue = calculateTimeLeft();
      if (!shouldContinue) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate]);

  const CountdownSection = () => (
    <div className="w-full max-w-sm mx-auto mb-8">
      {/* MATHX Header with Logo */}
      <div className="text-center mb-6">
        <div className="flex flex-col items-center space-y-3">
          <img 
            src={logo} 
            alt="MathX Logo" 
            className="w-16 h-16 object-cover scale-150"
          />
          <h1 className="text-3xl font-bold text-white tracking-wider">
            MathX
          </h1>
        </div>
      </div>

      {/* Countdown Banner */}
      <div 
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ backgroundColor: 'rgba(161, 70, 212, 0.65)' }}
      >
        <h2 className="text-lg font-semibold text-white mb-2">
          MathX Club Inauguration
        </h2>
        <p className="text-sm text-gray-200 mb-4">
          Join us for the grand opening of our math community
        </p>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300">DAYS</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300">HOURS</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300">MIN</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300">SEC</div>
          </div>
        </div>
      </div>
    </div>
  );

  const LinksSection = () => {
    // SVG Icon Components
    const MessageIcon = () => (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    );

    const InstagramIcon = () => (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );

    const GlobeIcon = () => (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    );

    const RegistrationIcon = () => (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
      </svg>
    );

    const links = [
      {
        icon: RegistrationIcon,
        title: "Registration",
        description: "Register for MathX Club membership",
        url: "#",
        color: "from-purple-500 to-indigo-500",
        isRegistration: true
      },
      {
        icon: MessageIcon,
        title: "Join our WhatsApp Community",
        description: "Connect with fellow math enthusiasts",
        url: "https://chat.whatsapp.com/IR5h08SJL3qDFjwvazgFA5?mode=ems_qr_t",
        color: "from-green-500 to-green-400"
      },
      {
        icon: InstagramIcon,
        title: "Follow us on Instagram",
        description: "Daily math tips and updates",
        url: "https://instagram.com/mathxpccoer",
        color: "from-pink-500 to-purple-500"
      },
      {
        icon: GlobeIcon,
        title: "Visit MathX Website",
        description: "Explore our full platform",
        url: "https://mathxpccoer.pages.dev",
        color: "from-blue-500 to-cyan-400"
      }
    ];

    const handleLinkClick = (link) => {
      if (link.isRegistration) {
        navigate('/registration');
      } else {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <div className="w-full max-w-sm mx-auto space-y-4">
        {links.map((link, index) => (
          <div
            key={index}
            onClick={() => handleLinkClick(link)}
            className="block group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 rounded-xl cursor-pointer"
          >
            <div 
              className="relative p-4 rounded-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95"
              style={{ backgroundColor: '#191D2A' }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A146D4] to-[#49E3FF] p-[2px]">
                <div 
                  className="w-full h-full rounded-xl"
                  style={{ backgroundColor: '#191D2A' }}
                />
              </div>
              
              {/* Content */}
              <div className="relative flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${link.color} group-hover:shadow-lg group-hover:shadow-cyan-400/25 transition-all duration-300`}>
                  <link.icon />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {link.title}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {link.description}
                  </p>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A146D4] to-[#49E3FF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ backgroundColor: '#191D2A' }}
    >
      <CountdownSection />
      <LinksSection />
    </div>
  );
};

export default LinksPage;
