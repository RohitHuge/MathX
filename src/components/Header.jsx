import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-[#191D2A]/95 border-b border-[#A146D4]/20 sticky top-0 z-50 backdrop-blur-sm transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-white font-bold text-2xl bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 bg-clip-text text-transparent">
              MathX
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-[#49E3FF] transition-colors duration-300 font-medium">
              Home
            </a>
            <a href="#about" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
              About
            </a>
            <a href="#events" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
              Events
            </a>
            <a href="#contact" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
              Contact
            </a>
            <button className="bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105">
              Join Us
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-[#49E3FF] transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#A146D4]/20">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-white hover:text-[#49E3FF] transition-colors duration-300 font-medium">
                Home
              </a>
              <a href="#about" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
                About
              </a>
              <a href="#events" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
                Events
              </a>
              <a href="#contact" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 font-medium">
                Contact
              </a>
              <button className="bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 w-fit">
                Join Us
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
