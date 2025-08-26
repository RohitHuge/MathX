import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {TextType} from '../components/ui/TextType.jsx';

// Hero Section Component
function HeroSection() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showScrollButton, setShowScrollButton] = useState(true);

  useEffect(() => {
    const targetDate = new Date('2024-09-25T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Hide button when scrolled past 80% of hero section
      if (scrollPosition > heroHeight * 0.8) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative text-white h-screen flex items-center justify-center overflow-hidden">
      {/* Full Height Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#A146D4]/60 via-[#191D2A] to-[#49E3FF]/60"></div>
      
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
        <div className="absolute top-1/3 left-1/2 text-5xl">∑</div>
        <div className="absolute top-2/3 right-1/2 text-4xl">∫</div>
        <div className="absolute top-5/6 left-1/6 text-3xl">π</div>
        <div className="absolute top-1/6 right-5/6 text-4xl">∞</div>
        <div className="absolute top-1/2 right-1/6 text-5xl">√</div>
        <div className="absolute top-1/6 left-5/6 text-3xl">∂</div>
      </div>
      
      {/* Dark Center Element */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/40 to-[#191D2A]/80"></div>
      
      {/* Floating Dark Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#191D2A]/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#191D2A]/40 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#191D2A]/50 rounded-full blur-lg"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 animate-fade-in">
          MathX
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90 font-medium">
          The X Factor of Maths
        </p> */}
        
        {/* Countdown Timer */}
        <div className="mb-8">
          <p className="text-sm mb-4 text-white/80">Inauguration on 25th September 🎉</p>
          <div className="flex justify-center space-x-4 md:space-x-8">
            {Object.entries(countdown).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                  <div className="text-2xl md:text-3xl font-bold">{value.toString().padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wider">{unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-[#49E3FF]/80 text-[#191D2A] px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform">
            Join Us
          </button>
          <button className="border-2 border-white/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/90 hover:text-[#191D2A] transition-all duration-300 hover:scale-105 transform">
            Learn More
          </button>
        </div>
        
        {/* Scroll Down Button */}
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-500 ${
          showScrollButton 
            ? 'opacity-100 translate-y-0 animate-bounce' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <button 
            onClick={() => document.getElementById('vision-purpose')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300"
            aria-label="Scroll down to explore more"
          >
            <span className="text-sm mb-2 font-medium">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse group-hover:bg-white transition-colors duration-300"></div>
            </div>
            <svg className="w-4 h-4 mt-1 text-white/60 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// Vision & Purpose Section Component
function VisionPurpose() {
  return (
    <section id="vision-purpose" className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/20 to-[#191D2A]/40"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-[#191D2A]/60 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-[#191D2A]/50 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why MathX Exists
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="group relative p-8 border border-[#A146D4]/30 rounded-xl bg-[#191D2A] hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#A146D4]/5 to-[#49E3FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#A146D4]/80 to-[#49E3FF]/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#49E3FF]">Vision</h3>
              <p className="text-[#AEAEAE] leading-relaxed">
                To create a world where mathematics is not just a subject, but a language of innovation, 
                problem-solving, and limitless possibilities that empowers every student to discover their 
                mathematical potential.
              </p>
            </div>
          </div>
          
          {/* Mission Card */}
          <div className="group relative p-8 border border-[#A146D4]/30 rounded-xl bg-[#191D2A] hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#A146D4]/5 to-[#49E3FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-bl from-[#A146D4]/80 to-[#49E3FF]/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#49E3FF]">Mission</h3>
              <p className="text-[#AEAEAE] leading-relaxed">
                To foster a vibrant community of math enthusiasts through engaging events, interactive 
                learning experiences, and collaborative problem-solving that makes mathematics accessible, 
                enjoyable, and inspiring for all skill levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Upcoming Events Section Component
function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "MathX Inauguration",
      date: "25th September 2024",
      time: "10:00 AM",
      description: "Join us for the grand opening of MathX Club with special guest speakers, interactive sessions, and networking opportunities.",
      highlight: "🎉 Grand Opening Event",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Weekly Online Quiz",
      date: "Every Saturday",
      time: "2:00 PM",
      description: "Test your mathematical skills in our weekly online quiz competition. Challenge yourself and compete with peers.",
      highlight: "Get Certificate Instantly",
      status: "ongoing"
    },
    {
      id: 3,
      title: "National Level Quiz",
      date: "Coming Soon",
      time: "TBA",
      description: "A prestigious national-level mathematics competition bringing together the best minds from across the country.",
      highlight: "🏆 National Competition",
      status: "planned"
    }
  ];

  return (
    <section id="events" className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/30 to-[#191D2A]/50"></div>
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-[#191D2A]/70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-44 h-44 bg-[#191D2A]/60 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Upcoming Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="group relative p-6 border border-[#A146D4]/30 rounded-xl bg-[#191D2A] hover:border-[#49E3FF] transition-all duration-500 hover:shadow-lg hover:shadow-[#49E3FF]/20 hover:scale-105 transform">
              <div className="absolute top-4 right-4">
                {event.status === 'upcoming' && (
                  <span className="bg-[#49E3FF] text-[#191D2A] px-2 py-1 rounded-full text-xs font-semibold">
                    Upcoming
                  </span>
                )}
                {event.status === 'ongoing' && (
                  <span className="bg-[#A146D4] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Ongoing
                  </span>
                )}
                {event.status === 'planned' && (
                  <span className="bg-[#0067A1] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Planned
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#49E3FF] transition-colors duration-300">
                {event.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3 text-[#AEAEAE] text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{event.date}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4 text-[#AEAEAE] text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.time}</span>
              </div>
              
              <p className="text-[#AEAEAE] text-sm mb-4 leading-relaxed">
                {event.description}
              </p>
              
              <div className="bg-gradient-to-r from-[#A146D4]/20 to-[#49E3FF]/20 border border-[#A146D4]/30 rounded-lg p-3">
                <p className="text-[#49E3FF] font-semibold text-sm text-center">
                  {event.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Quick Stats Section Component
function QuickStats() {
  const [counts, setCounts] = useState({
    members: 0,
    events: 0,
    quizzes: 0
  });

  const targetCounts = {
    members: 150,
    events: 12,
    quizzes: 25
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        members: Math.floor(targetCounts.members * progress),
        events: Math.floor(targetCounts.events * progress),
        quizzes: Math.floor(targetCounts.quizzes * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Members",
      count: counts.members,
      icon: "👥",
      color: "from-[#A146D4] to-[#49E3FF]"
    },
    {
      label: "Events Planned",
      count: counts.events,
      icon: "📅",
      color: "from-[#49E3FF] to-[#A146D4]"
    },
    {
      label: "Quizzes Hosted",
      count: counts.quizzes,
      icon: "🧮",
      color: "from-[#A146D4] to-[#49E3FF]"
    }
  ];

  return (
    <section className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/25 to-[#191D2A]/45"></div>
      <div className="absolute top-1/4 right-1/3 w-52 h-52 bg-[#191D2A]/65 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#191D2A]/55 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Quick Stats
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br from-[#A146D4]/80 to-[#49E3FF]/80 bg-clip-text text-transparent">
                {stat.count}+
              </div>
              <p className="text-[#AEAEAE] text-lg font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Join Us Call-to-Action Banner Component
function JoinBanner() {
  return (
    <section className="py-16 bg-gradient-to-bl from-[#A146D4]/70 via-[#191D2A] to-[#49E3FF]/70 text-white text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">∑</div>
        <div className="absolute bottom-20 right-10 text-5xl">∫</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">π</div>
        <div className="absolute top-1/3 right-1/4 text-3xl">√</div>
      </div>
      
      {/* Dark Center Element */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/30 to-[#191D2A]/60"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Be Part of the X Factor of Maths
        </h2>
        <p className="text-xl mb-8 text-white/90 leading-relaxed">
          Join our community of passionate mathematicians, problem solvers, and innovators. 
          Discover the beauty of mathematics through interactive experiences and collaborative learning.
        </p>
        <button className="bg-white/90 text-[#191D2A] px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-white/25 transition-all duration-300 hover:scale-105 transform">
          Register Now
        </button>
      </div>
    </section>
  );
}

// Math Fun Fact Rotator Component
function FunFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  const funFacts = [
    "Did you know π has been calculated to 62 trillion digits?",
    "The word 'mathematics' comes from the Greek 'mathema' meaning 'learning'.",
    "Zero is the only number that cannot be represented in Roman numerals.",
    "A 'jiffy' is an actual unit of time: 1/100th of a second.",
    "The symbol for division (÷) is called an obelus.",
    "Every even number greater than 2 can be expressed as the sum of two primes."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [funFacts.length]);

  return (
    <section className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/35 to-[#191D2A]/55"></div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-36 h-36 bg-[#191D2A]/70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/2 transform translate-x-1/2 w-32 h-32 bg-[#191D2A]/60 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Math Fun Facts
        </h2>
        
        <div className="relative">
          <div className="bg-gradient-to-tl from-[#A146D4]/20 to-[#49E3FF]/20 border border-[#A146D4]/30 rounded-xl p-8 md:p-12">
            <div className="text-6xl mb-6">🧮</div>
            <p className="text-xl md:text-2xl text-white leading-relaxed min-h-[60px] flex items-center justify-center">
              {funFacts[currentFactIndex]}
            </p>
            
            {/* Fact Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {funFacts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFactIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFactIndex 
                      ? 'bg-[#49E3FF] scale-125' 
                      : 'bg-[#AEAEAE] hover:bg-[#49E3FF]/50'
                  }`}
                  aria-label={`Go to fact ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  useEffect(() => {
    document.title = "MathX | The X Factor of Maths";
  }, []);

  return (
    <div className="bg-[#191D2A] font-display min-h-screen">
      <Header />
      <HeroSection />
      <VisionPurpose />
      <UpcomingEvents />
      <QuickStats />
      <JoinBanner />
      <FunFacts />
      <Footer />
    </div>
  );
}
