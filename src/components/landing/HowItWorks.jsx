import React from 'react';
import { motion } from 'motion/react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Register",
      description: "Create your account and join our community of math enthusiasts",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "from-[#A146D4] to-[#49E3FF]"
    },
    {
      id: 2,
      title: "Join Contest",
      description: "Browse available contests and register for the ones that interest you",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#49E3FF] to-[#A146D4]"
    },
    {
      id: 3,
      title: "Compete in Timed MCQs",
      description: "Solve challenging math problems within the time limit and test your skills",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#A146D4] to-[#49E3FF]"
    },
    {
      id: 4,
      title: "Get Score + Certificate",
      description: "Receive instant results and earn certificates for your achievements",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: "from-[#49E3FF] to-[#A146D4]"
    }
  ];

  return (
    <section id="how-it-works" className="pt-8 pb-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/20 to-[#191D2A]/40"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-[#A146D4]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-[#49E3FF]/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-[#AEAEAE] text-lg max-w-2xl mx-auto">
            Get started with our math contest platform in just four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Connection Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#A146D4]/30 to-[#49E3FF]/30 transform translate-x-4 z-0"></div>
              )}

              <div className="relative bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 h-full backdrop-blur-sm group-hover:border-[#49E3FF] transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#49E3FF]/20 group-hover:scale-105 transform">
                {/* Step Number */}
                <div className="absolute -top-4 left-6">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm border-2 border-[#191D2A]`}>
                    {step.id}
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#49E3FF] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[#AEAEAE] leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#A146D4]/5 to-[#49E3FF]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Ready to Start Your Journey?
            </h3>
            <p className="text-[#AEAEAE] mb-6">
              Join thousands of students who are already competing and improving their math skills
            </p>
            <button className="bg-gradient-to-r from-[#49E3FF] to-[#A146D4] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:ring-offset-2 focus:ring-offset-[#191D2A]">
              Get Started Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
