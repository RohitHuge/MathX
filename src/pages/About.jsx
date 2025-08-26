import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Banner Section Component
function BannerSection() {
  return (
    <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
      {/* Solid Purple Background with 65% opacity */}
      <div className="absolute inset-0 bg-[#A146D4]/65"></div>
      
      {/* Floating Math Symbols */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 text-6xl text-white/20 animate-float-slow">π</div>
        <div className="absolute top-32 right-32 text-5xl text-white/20 animate-float-slow" style={{ animationDelay: '2s' }}>∑</div>
        <div className="absolute bottom-24 left-1/3 text-4xl text-white/20 animate-float-slow" style={{ animationDelay: '4s' }}>∞</div>
        <div className="absolute bottom-32 right-1/4 text-5xl text-white/20 animate-float-slow" style={{ animationDelay: '6s' }}>√</div>
        <div className="absolute top-1/2 left-1/2 text-3xl text-white/20 animate-float-slow" style={{ animationDelay: '8s' }}>∫</div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white animate-on-scroll" data-delay="200">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          About MathX
        </h1>
        <p className="text-2xl md:text-3xl text-white/90">
          The X Factor of Maths
        </p>
      </div>
    </section>
  );
}

// Vision & Purpose Section Component
function VisionPurpose() {
  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-on-scroll" data-delay="100">
          Our Vision & Purpose
        </h2>
        <p className="text-xl text-[#AEAEAE] leading-relaxed mb-12 max-w-3xl mx-auto animate-on-scroll" data-delay="300">
          MathX Club is dedicated to fostering a vibrant community of mathematics enthusiasts, 
          problem solvers, and innovators. We believe that mathematics is not just a subject 
          but a language that unlocks the mysteries of the universe.
        </p>
        
        {/* Inspiring Math Quote */}
        <div className="relative p-8 border border-transparent bg-gradient-to-r from-[#A146D4]/20 to-[#49E3FF]/20 rounded-2xl animate-on-scroll" data-delay="500">
          <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-2xl opacity-20"></div>
          <div className="relative">
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-4">
              "Mathematics is the art of giving the same name to different things."
            </blockquote>
            <cite className="text-lg text-[#49E3FF] font-semibold">
              — Henri Poincaré
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mentor Section Component
function MentorSection() {
  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 animate-on-scroll" data-delay="100">
          Our Mentor
        </h2>
        
        {/* Mentor Card */}
        <div className="group relative max-w-2xl mx-auto animate-on-scroll" data-delay="300">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          
          {/* Card Content */}
          <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-2xl p-8 group-hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Mentor Photo */}
              <div className="w-32 h-32 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center border-2 border-[#A146D4]/30">
                <span className="text-4xl text-[#49E3FF]">👨‍🏫</span>
              </div>
              
              {/* Mentor Info */}
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Dr. Alexander Chen</h3>
                <p className="text-lg text-[#49E3FF] mb-3">Head of Mathematics Department</p>
                <p className="text-[#AEAEAE] mb-4">
                  Ph.D. in Applied Mathematics, Stanford University<br/>
                  Specializes in Number Theory and Mathematical Modeling
                </p>
                <p className="text-[#AEAEAE] mb-4">
                  📧 alexander.chen@university.edu<br/>
                  📱 +1 (555) 987-6543
                </p>
                
                {/* Inspiring Message */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10 rounded-lg border border-[#A146D4]/20">
                  <p className="text-white italic">
                    "Mathematics is the foundation of all sciences. Every problem has a solution, 
                    and every solution leads to new discoveries."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Core Team Section Component
function CoreTeamSection() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "President",
      tagline: "Fav: Euler's Identity",
      emoji: "👑"
    },
    {
      name: "Michael Rodriguez",
      role: "Vice President",
      tagline: "Fav: Golden Ratio",
      emoji: "⭐"
    },
    {
      name: "Emily Chen",
      role: "Secretary",
      tagline: "Fav: Pi (π)",
      emoji: "📝"
    },
    {
      name: "David Kim",
      role: "Treasurer",
      tagline: "Fav: Fibonacci Sequence",
      emoji: "💰"
    },
    {
      name: "Lisa Wang",
      role: "Events Coordinator",
      tagline: "Fav: Prime Numbers",
      emoji: "🎯"
    },
    {
      name: "James Thompson",
      role: "Public Relations",
      tagline: "Fav: Complex Numbers",
      emoji: "📢"
    }
  ];

  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 animate-on-scroll" data-delay="100">
          Core Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative animate-on-scroll" data-delay={200 + (index * 100)}>
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-xl p-6 group-hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
                {/* Photo Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center border-2 border-[#A146D4]/30 mx-auto mb-4">
                  <span className="text-3xl">{member.emoji}</span>
                </div>
                
                {/* Member Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-lg text-[#49E3FF] mb-3">{member.role}</p>
                  <p className="text-sm text-[#AEAEAE] italic">{member.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Values Section Component
function ValuesSection() {
  const values = [
    {
      title: "Learn Collaboratively",
      description: "We believe in the power of collective intelligence and peer learning.",
      icon: "🤝"
    },
    {
      title: "Compete Fairly",
      description: "Healthy competition drives innovation and personal growth.",
      icon: "🏆"
    },
    {
      title: "Share Resources",
      description: "Knowledge grows when shared freely among passionate learners.",
      icon: "📚"
    },
    {
      title: "Celebrate Maths",
      description: "Every mathematical discovery is a victory worth celebrating.",
      icon: "🎉"
    },
    {
      title: "Think Creatively",
      description: "Mathematics is an art that requires imagination and innovation.",
      icon: "💡"
    }
  ];

  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 animate-on-scroll" data-delay="100">
          Our Values
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="group relative animate-on-scroll" data-delay={300 + (index * 150)}>
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-xl p-6 group-hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center border border-[#A146D4]/30 mx-auto mb-4">
                  <span className="text-2xl">{value.icon}</span>
                </div>
                
                {/* Value Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-[#AEAEAE] leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Achievement Section Component
function AchievementSection() {
  const achievements = [
    {
      title: "Successful Inauguration",
      description: "Launched MathX Club with 50+ founding members on September 25th, 2024.",
      date: "September 2024",
      icon: "🚀"
    },
    {
      title: "First Weekly Quiz",
      description: "Hosted our inaugural online mathematics quiz with 30+ participants.",
      date: "October 2024",
      icon: "🧮"
    },
    {
      title: "Member Milestone",
      description: "Reached 100+ active members within the first month of operation.",
      date: "October 2024",
      icon: "👥"
    },
    {
      title: "University Recognition",
      description: "Received official recognition and support from the Mathematics Department.",
      date: "September 2024",
      icon: "🏛️"
    }
  ];

  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 animate-on-scroll" data-delay="100">
          Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="group relative animate-on-scroll" data-delay={400 + (index * 200)}>
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-xl p-6 group-hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center border border-[#A146D4]/30 flex-shrink-0">
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  
                  {/* Achievement Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-[#AEAEAE] mb-3 leading-relaxed">{achievement.description}</p>
                    <span className="text-sm text-[#49E3FF] font-medium">{achievement.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main About Component
export default function About() {
  useEffect(() => {
    document.title = "About MathX | The X Factor of Maths";
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
      <main>
        <BannerSection />
        <VisionPurpose />
        <MentorSection />
        <CoreTeamSection />
        <ValuesSection />
        <AchievementSection />
      </main>
      <Footer />
    </div>
  );
}
