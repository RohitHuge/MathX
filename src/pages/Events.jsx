import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Event Modal Component
function EventModal({ event, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-xl p-6 md:p-8 max-w-2xl w-full mx-4 animate-in slide-in-from-bottom-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Event Content */}
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-start">
            {event.status === 'upcoming' && (
              <span className="bg-[#49E3FF] text-[#191D2A] px-3 py-1 rounded-full text-sm font-semibold">
                Upcoming
              </span>
            )}
            {event.status === 'ongoing' && (
              <span className="bg-[#A146D4] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Ongoing
              </span>
            )}
            {event.status === 'planned' && (
              <span className="bg-[#0067A1] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Planned
              </span>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {event.title}
          </h2>
          
          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-[#AEAEAE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg">{event.date}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-[#AEAEAE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg">{event.time}</span>
            </div>
          </div>
          
          {/* Highlight */}
          <div className="bg-gradient-to-r from-[#A146D4]/20 to-[#49E3FF]/20 border border-[#A146D4]/30 rounded-lg p-4">
            <p className="text-[#49E3FF] font-semibold text-lg text-center">
              {event.highlight}
            </p>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">About This Event</h3>
            <p className="text-[#AEAEAE] leading-relaxed text-lg">
              {event.description}
            </p>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="bg-[#49E3FF]/80 text-[#191D2A] px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
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
          MathX Events
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90 font-medium animate-on-scroll" data-delay="200">
          Engage. Compete. Learn.
        </p>
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-on-scroll" data-delay="400">
          Discover exciting mathematical challenges, competitions, and learning opportunities 
          that will push your skills to the next level.
        </p>
      </div>
    </section>
  );
}

// Events Grid Section Component
function EventsGrid() {
  const events = [
    {
      id: 1,
      title: "Recuretment Drive",
      date: "28th August 2025 onwards",
      time: "TBA",
      description: "Join us for the recuretment drive of MathX Club. We are looking for new members to join our club. If you are interested in joining our club, please fill the form below.",
      highlight: "🎉 Welcoming New Maths Enthusiasts",
      status: "upcoming"
    },
    {
      id: 2,
      title: "MathX Inauguration",
      date: "25th September 2025",
      time: "10:00 AM",
      description: "Join us for the grand opening of MathX Club with special guest speakers, interactive sessions, and networking opportunities.",
      highlight: "🎉 Grand Opening Event",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Weekly Online Quiz",
      date: "26th September 2025 onwards(Every Thursday)",
      time: "2:00 PM",
      description: "Test your mathematical skills in our weekly online quiz competition. Challenge yourself and compete with peers.",
      highlight: "Get Certificate Instantly",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Maths Premier League",
      date: "Coming Soon",
      time: "TBA",
      description: "A fun auction of brilliant minds in mathematics. Competiting with each other to win the title of Maths Premier League.",
      highlight: "🏆 Maths Premier League",
      status: "upcoming"
    },
    {
      id: 5,
      title: "National Level Quiz",
      date: "Coming Soon",
      time: "TBA",
      description: "A prestigious national-level mathematics competition bringing together the best minds from across the country.",
      highlight: "🏆 National Competition",
      status: "planned"
    }
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className="py-16 bg-[#191D2A] text-white relative overflow-hidden">
      {/* Dark Center Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/30 to-[#191D2A]/50"></div>
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-[#191D2A]/70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-44 h-44 bg-[#191D2A]/60 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-on-scroll">
          All Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="group relative p-6 border border-[#A146D4]/30 rounded-xl bg-[#191D2A] hover:border-[#49E3FF] transition-all duration-500 hover:shadow-lg hover:shadow-[#49E3FF]/20 hover:scale-105 transform animate-on-scroll cursor-pointer" 
              data-delay={index * 200}
              onClick={() => openModal(event)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A146D4]/5 to-[#49E3FF]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Status Badge */}
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
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#49E3FF] transition-colors duration-300 pr-20">
                  {event.title}
                </h3>
                
                {/* Date */}
                <div className="flex items-center space-x-2 mb-3 text-[#AEAEAE] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                
                {/* Time */}
                <div className="flex items-center space-x-2 mb-4 text-[#AEAEAE] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.time}</span>
                </div>
                
                {/* Highlight */}
                <div className="bg-gradient-to-r from-[#A146D4]/20 to-[#49E3FF]/20 border border-[#A146D4]/30 rounded-lg p-3">
                  <p className="text-[#49E3FF] font-semibold text-sm text-center">
                    {event.highlight}
                  </p>
                </div>
                
                {/* Click Hint */}
                <div className="mt-4 text-center">
                  <p className="text-[#AEAEAE] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to view details
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12 animate-on-scroll" data-delay="600">
          <p className="text-[#AEAEAE] text-lg mb-6">
            Can't find what you're looking for? Contact us to suggest new events!
          </p>
          <button className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#A146D4]/25 transition-all duration-300 hover:scale-105 transform">
            Suggest Event
          </button>
        </div>
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
}

// Upcoming Events Highlight Section
function UpcomingHighlight() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#A146D4]/20 via-[#191D2A] to-[#49E3FF]/20 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/20 to-[#191D2A]/40"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#A146D4]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-[#49E3FF]/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-on-scroll">
          Mark Your Calendar
        </h2>
        
        <div className="bg-[#191D2A]/80 border border-[#A146D4]/30 rounded-xl p-8 md:p-12 animate-on-scroll" data-delay="200">
          <div className="text-6xl mb-6">📅</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#49E3FF]">
            MathX Inauguration
          </h3>
          <p className="text-xl text-[#AEAEAE] mb-6">
            Join us for the grand opening of MathX Club on <span className="text-[#49E3FF] font-semibold">25th September 2024</span>
          </p>
          <p className="text-lg text-[#AEAEAE] mb-8 leading-relaxed">
            Special guest speakers, interactive sessions, networking opportunities, and much more await you at this historic event.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#49E3FF]/80 text-[#191D2A] px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform">
              Register Now
            </button>
            <button className="border-2 border-[#A146D4]/80 text-[#A146D4] px-8 py-3 rounded-lg font-semibold hover:bg-[#A146D4] hover:text-white transition-all duration-300 hover:scale-105 transform">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Events Component
export default function Events() {
  useEffect(() => {
    document.title = "MathX Events | Engage. Compete. Learn.";
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
      <EventsGrid />
      <UpcomingHighlight />
      <Footer />
    </div>
  );
}
