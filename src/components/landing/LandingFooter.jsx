import React from 'react';
import { motion } from 'motion/react';

const LandingFooter = () => {
  const navigationLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Contests', href: '#contests' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const quickLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'Community', href: '#community' },
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      ),
      href: 'https://www.instagram.com/mathxpccoer',
      color: 'hover:text-pink-400'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      href: "https://chat.whatsapp.com/IR5h08SJL3qDFjwvazgFA5?mode=ems_qr_t",
      color: 'hover:text-green-400'
    },
    {
      name: 'Website',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: 'https://mathxpccoer.pages.dev',
      color: 'hover:text-blue-400'
    }
  ];

  return (
    <footer className="bg-[#A146D4]/65 border-t border-white/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-4xl text-white animate-float-slow">∑</div>
        <div className="absolute bottom-20 right-10 text-3xl text-white animate-float-slow" style={{ animationDelay: '2s' }}>∫</div>
        <div className="absolute top-1/2 left-1/4 text-2xl text-white animate-float-slow" style={{ animationDelay: '4s' }}>π</div>
        <div className="absolute top-1/3 right-1/3 text-3xl text-white animate-float-slow" style={{ animationDelay: '6s' }}>∞</div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <span className="text-white font-bold text-3xl">
                MathX
              </span>
            </motion.div>
            <motion.p 
              className="text-white text-base leading-relaxed max-w-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              The X Factor of Maths - Empowering students through mathematical excellence, 
              innovative learning, and a community of passionate mathematicians.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white border border-white/30 transition-all duration-300 hover:scale-110 ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div>
            <motion.h3 
              className="text-white font-bold text-lg mb-6 border-b border-white/30 pb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Navigation
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {navigationLinks.map((link, index) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3 
              className="text-white font-bold text-lg mb-6 border-b border-white/30 pb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white hover:text-[#49E3FF] transition-colors duration-300 text-base font-medium flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#49E3FF] rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-white/30 mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-white/90 text-sm">
                © 2025 MathX Club. All rights reserved.
              </p>
              <p className="text-white/70 text-xs mt-1">
                Empowering mathematical minds, one equation at a time.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-white/80 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/80 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white/80 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default LandingFooter;
