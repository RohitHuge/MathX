import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#191D2A] border-t border-[#A146D4]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-white font-bold text-2xl bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 bg-clip-text text-transparent">
                MathX
              </span>
            </div>
            <p className="text-[#AEAEAE] text-sm leading-relaxed max-w-md">
              The X Factor of Maths - Empowering students through mathematical excellence, 
              innovative learning, and a community of passionate mathematicians.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#events" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#AEAEAE] hover:text-[#49E3FF] transition-colors duration-300 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-[#AEAEAE] text-sm">
                <span className="text-[#49E3FF]">📍</span> Math Department
              </li>
              <li className="text-[#AEAEAE] text-sm">
                <span className="text-[#49E3FF]">📧</span> mathx@university.edu
              </li>
              <li className="text-[#AEAEAE] text-sm">
                <span className="text-[#49E3FF]">📱</span> +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-[#A146D4]/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#A146D4]/20 rounded-lg flex items-center justify-center text-[#AEAEAE] hover:text-[#49E3FF] hover:bg-[#A146D4]/30 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#A146D4]/20 rounded-lg flex items-center justify-center text-[#AEAEAE] hover:text-[#49E3FF] hover:bg-[#A146D4]/30 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#A146D4]/20 rounded-lg flex items-center justify-center text-[#AEAEAE] hover:text-[#49E3FF] hover:bg-[#A146D4]/30 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#A146D4]/20 rounded-lg flex items-center justify-center text-[#AEAEAE] hover:text-[#49E3FF] hover:bg-[#A146D4]/30 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <p className="text-[#AEAEAE] text-sm">
              © 2024 MathX Club. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
