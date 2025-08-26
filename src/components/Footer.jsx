import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#A146D4]/65 border-t border-white/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-4xl text-white">∑</div>
        <div className="absolute bottom-20 right-10 text-3xl text-white">∫</div>
        <div className="absolute top-1/2 left-1/4 text-2xl text-white">π</div>
        <div className="absolute top-1/3 right-1/3 text-3xl text-white">∞</div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <span className="text-white font-bold text-3xl">
                MathX
              </span>
            </div>
            <p className="text-white text-base leading-relaxed max-w-lg mb-6">
              The X Factor of Maths - Empowering students through mathematical excellence, 
              innovative learning, and a community of passionate mathematicians.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:text-[#49E3FF] hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:text-[#49E3FF] hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:text-[#49E3FF] hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:text-[#49E3FF] hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-white/30 pb-2">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="#home" className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group">
                  <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group">
                  <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  About
                </a>
              </li>
              <li>
                <a href="#events" className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group">
                  <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Events
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group">
                  <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-white/30 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="text-white text-base flex items-start">
                <span className="text-[#49E3FF] text-xl mr-3 mt-1">📍</span>
                <span>MathX Club<br/>PCCOER, Ravet, Pune</span>
              </li>
              <li className="text-white text-base flex items-start">
                <span className="text-[#49E3FF] text-xl mr-3 mt-1">📧</span>
                <span>matxpccoer@gmail.com</span>
              </li>
              {/* <li className="text-white text-base flex items-start">
                <span className="text-[#49E3FF] text-xl mr-3 mt-1">📱</span>
                <span>+1 (555) 123-4567</span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-white/90 text-sm">
                © 2024 MathX Club. All rights reserved.
              </p>
              <p className="text-white/70 text-xs mt-1">
                Empowering mathematical minds, one equation at a time.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
