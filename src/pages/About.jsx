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
  const mentors = [
    {
      name: "Mrs. Manisha Deshpande",
      role: "Head of Mathematics Department (FE)",
      qualification: "M.Sc. in Mathematics, Pune University( Gold Medalist), NET AIR38",
      specialization: "Specializes in Calculus and Graph Theory",
      email: "manisha.deshpande@pccoer.in",
      phone: "+91 9823000000",
      emoji: "👨‍🏫",
      message: "Mathematics is the foundation of all sciences. Every problem has a solution, and every solution leads to new discoveries."
    },
    {
      name: "Mr. Sachin Varpe",
      role: "Professor of Applied Mathematics",
      qualification: "M.Sc., B.Ed. , SET",
      specialization: "PhD. Persuing in Intergral Transform",
      email: "sachin.varpe@pccoer.in",
      phone: "+91 9876543210",
      emoji: "👨‍🎓",
      message: "Mathematics is not just about numbers and formulas; it's about understanding the patterns that govern our universe."
    }
  ];

  return (
    <section className="py-20 bg-[#191D2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 animate-on-scroll" data-delay="100">
          Our Mentors
        </h2>
        
        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mentors.map((mentor, index) => (
            <div key={index} className="group relative animate-on-scroll" data-delay={300 + (index * 200)}>
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative bg-[#191D2A] border border-[#A146D4]/30 rounded-2xl p-8 group-hover:border-[#A146D4] transition-all duration-500 hover:shadow-lg hover:shadow-[#A146D4]/20 hover:scale-105 transform">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Mentor Photo */}
                  <div className="w-32 h-32 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center border-2 border-[#A146D4]/30">
                    <span className="text-4xl text-[#49E3FF]">{mentor.emoji}</span>
                  </div>
                  
                  {/* Mentor Info */}
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{mentor.name}</h3>
                    <p className="text-lg text-[#49E3FF] mb-3">{mentor.role}</p>
                    <p className="text-[#AEAEAE] mb-4">
                      {mentor.qualification}<br/>
                      {mentor.specialization}
                    </p>
                    <p className="text-[#AEAEAE] mb-4">
                      📧 {mentor.email}<br/>
                      📱 {mentor.phone}
                    </p>
                    
                    {/* Inspiring Message */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10 rounded-lg border border-[#A146D4]/20">
                      <p className="text-white italic">
                        "{mentor.message}"
                      </p>
                    </div>
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

// Core Team Section Component
function CoreTeamSection() {
  const [activeTeamIndex, setActiveTeamIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const teams = [
    {
      name: "Tech",
      members: [
        { name: "Rohit H.", role: "SE COMP", tagline: "Backend Wizard", emoji: "🖥️" },
        { name: "Viraj R.", role: "SE COMP", tagline: "UI/UX Enthusiast", emoji: "🎛️" },
        { name: "Veer S.", role: "SE COMP", tagline: "Algorithm Ace", emoji: "🧮" },
        { name: "Om B.", role: "SE COMP", tagline: "Performance Tuner", emoji: "⚙️" },
        { name: "Mayur R.", role: "SE COMP", tagline: "API Architect", emoji: "🔌" },
        { name: "Priya K.", role: "SE COMP", tagline: "Code Reviewer", emoji: "📝" }
      ]
    },
    {
      name: "Design",
      members: [
        { name: "Soham S.", role: "SE COMP", tagline: "Color Maestro", emoji: "🌈" },
        { name: "Bipasha", role: "SE COMP", tagline: "Layout Virtuoso", emoji: "📐" },
        { name: "Parth S.", role: "SE COMP", tagline: "Typography Fanatic", emoji: "🔤" },
        { name: "Suyash S.", role: "SE COMP", tagline: "Minimalism Lover", emoji: "🧊" }
      ]
    },
    {
      name: "Execution",
      members: [
        { name: "Raj S.", role: "SE COMP", tagline: "Taskmaster", emoji: "🗂️" },
        { name: "Rushikesh P.", role: "SE COMP", tagline: "Deadline Chaser", emoji: "⏰" },
        { name: "Shraddha", role: "SE COMP", tagline: "Checklist Champion", emoji: "✅" },
        { name: "Raj B.", role: "SE COMP", tagline: "Logistics Pro", emoji: "🚚" },
        { name: "Prathamesh K.", role: "SE COMP", tagline: "Resource Handler", emoji: "📦" }
      ]
    },
    {
      name: "Marketing",
      members: [
        { name: "Shivraj P.", role: "SE COMP", tagline: "Social Media Guru", emoji: "📱" },
        { name: "Saloni S.", role: "SE COMP", tagline: "Brand Builder", emoji: "🏷️" },
        { name: "Sakshi V.", role: "SE COMP", tagline: "Content Creator", emoji: "✒️" },
        { name: "Harshada", role: "SE COMP", tagline: "Outreach Expert", emoji: "🌐" }
      ]
    },
    {
      name: "Question Making",
      members: [
        { name: "Shadab S.", role: "SE COMP", tagline: "Puzzle Crafter", emoji: "🧩" },
        { name: "Sopan ", role: "SE COMP", tagline: "Theorem Hunter", emoji: "🔎" },
        { name: "Aditya P.", role: "SE ENTC", tagline: "Sequence Specialist", emoji: "🔢" },
        { name: "Anup ", role: "SE MECH", tagline: "Pattern Finder", emoji: "🔍" },
        { name: "Mayur D.", role: "SE COMP", tagline: "Logic Designer", emoji: "🧠" },
        { name: "Chaitanya P.", role: "SE COMP", tagline: "Quiz Master", emoji: "🏆" },
        { name: "Khushi", role: "SE COMP", tagline: "Riddle Enthusiast", emoji: "🕵️" }
      ]
    },
    {
      name: "Admin",
      members: [
        { name: "Krishna P.", role: "SE COMP", tagline: "Organizer-in-Chief", emoji: "📅" },
        { name: "Rajat K.", role: "SE COMP", tagline: "Efficiency Expert"  , emoji: "⚡" },
        { name: "Shravani J.", role: "SE COMP", tagline:"Finance Guru", emoji: "💸" },
        { name: "Parth", role: "SE COMP", tagline: "Record Keeper", emoji: "🗃️" },
        { name: "Vedant P.", role: "SE COMP", tagline: "Compliance Expert", emoji: "🛡️" },
        { name: "Kushagra B.", role: "SE COMP", tagline: "Support Specialist", emoji: "🆘" }
      ]
    }
  ];

  // Auto-rotation effect
  React.useEffect(() => {
    if (isHovered || isTransitioning) return; // Pause on hover or during transitions

    const interval = setInterval(() => {
      setActiveTeamIndex((prevIndex) => (prevIndex + 1) % teams.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, isTransitioning, teams.length]);

  const handleTabClick = (index) => {
    if (index === activeTeamIndex) return; // Don't switch if already active
    
    setIsTransitioning(true);
    setActiveTeamIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section 
      className="py-20 bg-[#191D2A]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Team Members
        </h2>
        
        {/* Team Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {teams.map((team, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`relative px-6 py-3 text-lg font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A146D4]/50 rounded-lg ${
                activeTeamIndex === index
                  ? 'text-white'
                  : 'text-[#AEAEAE] hover:text-white'
              }`}
            >
              {team.name}
              {/* Active tab gradient underline */}
              {activeTeamIndex === index && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Team Members Grid with Fade Animation */}
        <div className="relative min-h-[400px] overflow-hidden">
          <div 
            key={activeTeamIndex}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in"
          >
            {teams[activeTeamIndex].members.map((member, index) => (
              <div key={`${activeTeamIndex}-${index}`} className="group relative">
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
                    <p className="text-sm text-[#49E3FF] mb-2">{member.role}</p>
                    <p className="text-sm text-[#AEAEAE] italic">{member.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      title: "National Level Maths Quiz at Pillani College Pune",
      description: "One team of MathX Club won the first prize in the National Level Maths Quiz at Pillani College Pune. Among the 4 shortlisted teams from MathX",
      date: "2024",
      icon: "🚀"
    },
    {
      title: "First Weekly Quiz",
      description: "Hosted our inaugural online mathematics quiz with 30+ participants.",
      date: "October 2024",
      icon: "🧮"
    },
    // {
    //   title: "Member Milestone",
    //   description: "Reached 100+ active members within the first month of operation.",
    //   date: "October 2024",
    //   icon: "👥"
    // },
    // {
    //   title: "University Recognition",
    //   description: "Received official recognition and support from the Mathematics Department.",
    //   date: "September 2024",
    //   icon: "🏛️"
    // }
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
