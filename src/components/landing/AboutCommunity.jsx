import React from 'react';
import { motion } from 'motion/react';

const AboutCommunity = ({ onJoinWhatsApp }) => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: 'hover:text-green-400',
      href: '#'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      ),
      color: 'hover:text-pink-400',
      href: 'https://www.instagram.com/mathxpccoer'
    },
    {
      name: 'Website',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      color: 'hover:text-blue-400',
      href: '#'
    }
  ];

  return (
    <section className="pt-8 pb-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/20 to-[#191D2A]/40"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#49E3FF]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-[#A146D4]/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                About MathX
              </span>
            </h2>
            
            <div className="space-y-6 text-[#AEAEAE] leading-relaxed">
              <p className="text-lg">
                MathX is more than just a contest platform - it's a vibrant community of math enthusiasts, 
                problem solvers, and future mathematicians. We believe that mathematics is the foundation 
                of innovation and critical thinking.
              </p>
              
              <p>
                Our platform brings together students from all backgrounds to compete, learn, and grow 
                through engaging mathematical challenges. Whether you're a beginner looking to improve 
                your skills or an advanced student seeking new challenges, MathX provides the perfect 
                environment for mathematical excellence.
              </p>
              
              <p>
                Join our community of passionate learners who are shaping the future of mathematics, 
                one problem at a time. Together, we're building a world where math is not just a subject, 
                but a way of thinking and solving real-world challenges.
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-[#AEAEAE] text-sm">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#49E3FF] to-[#A146D4] bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-[#AEAEAE] text-sm">Contests Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-[#AEAEAE] text-sm">Success Rate</div>
              </div>
            </div>
          </motion.div>

          {/* Community Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-[#49E3FF] to-[#A146D4] bg-clip-text text-transparent">
                  Join Our Community
                </span>
              </h3>
              
              <p className="text-[#AEAEAE] text-center mb-8 leading-relaxed">
                Connect with fellow math enthusiasts, share knowledge, and stay updated with the latest 
                contests and events. Our community is always growing and welcoming new members!
              </p>

              {/* Social Links */}
              <div className="flex justify-center space-x-6 mb-8">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white border border-white/20 transition-all duration-300 hover:scale-110 ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* WhatsApp Community Button */}
              <div className="text-center">
                <button
                  onClick={onJoinWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#191D2A] flex items-center justify-center mx-auto space-x-2"
                  aria-label="Join our WhatsApp community"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Join WhatsApp Community</span>
                </button>
              </div>

              {/* Community Features */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 text-[#AEAEAE]">
                  <div className="w-2 h-2 bg-[#49E3FF] rounded-full"></div>
                  <span>Daily math challenges and tips</span>
                </div>
                <div className="flex items-center space-x-3 text-[#AEAEAE]">
                  <div className="w-2 h-2 bg-[#A146D4] rounded-full"></div>
                  <span>Contest announcements and updates</span>
                </div>
                <div className="flex items-center space-x-3 text-[#AEAEAE]">
                  <div className="w-2 h-2 bg-[#49E3FF] rounded-full"></div>
                  <span>Peer support and collaboration</span>
                </div>
                <div className="flex items-center space-x-3 text-[#AEAEAE]">
                  <div className="w-2 h-2 bg-[#A146D4] rounded-full"></div>
                  <span>Expert guidance and mentorship</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutCommunity;
