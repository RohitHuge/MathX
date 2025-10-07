import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const CombinedHero = ({ 
  contest, 
  leaderboard, 
  isLoggedIn, 
  onRegister, 
  onLogin, 
  onViewContests,
  onViewFullLeaderboard 
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLive, setIsLive] = useState(false);
  const [timeUntilEnd, setTimeUntilEnd] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer logic
  useEffect(() => {
    if (!contest?.start_time) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(contest.start_time).getTime();
      const difference = startTime - now;

      // Check if contest is live (started but not ended)
      if (difference <= 0) {
        // Contest has started, check if it's still within duration
        const durationMinutes = parseInt(contest.duration.replace(/\D/g, '')) || 60; // Extract number from duration string
        const endTime = startTime + (durationMinutes * 60 * 1000);
        const timeUntilEnd = endTime - now;

        if (timeUntilEnd > 0) {
          // Contest is live - calculate time until end
          const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);

          setTimeUntilEnd({ days, hours, minutes, seconds });
          setIsLive(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          // Contest has ended, show as upcoming (this shouldn't happen with proper data)
          setIsLive(false);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setTimeUntilEnd({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } else {
        // Contest hasn't started yet
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsLive(false);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [contest?.start_time, contest?.duration]);

  const getButtonText = () => {
    if (isLive) return "Start Contest";
    if (isLoggedIn) return "Attempt Contest";
    return "Login to Participate";
  };

  const handleButtonClick = () => {
    if (isLive) {
      // If contest is live, redirect to contest page
      window.location.href = `/contest/${contest.id}`;
    } else if (isLoggedIn) {
      // If user is logged in, register for contest
      onRegister(contest.id);
    } else {
      // If user is not logged in, redirect to auth page
      navigate('/auth');
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-[#A146D4] to-[#49E3FF]';
    }
  };

  return (
    <section id="hero-section" className="relative text-white min-h-screen flex items-start justify-center overflow-hidden bg-[#191D2A] pt-16 pb-8">
      {/* Background Math Symbols */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl animate-float-slow">∑</div>
        <div className="absolute top-32 right-20 text-5xl animate-float-slow" style={{ animationDelay: '1s' }}>∫</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float-slow" style={{ animationDelay: '2s' }}>π</div>
        <div className="absolute bottom-32 right-10 text-5xl animate-float-slow" style={{ animationDelay: '3s' }}>∞</div>
        <div className="absolute top-1/2 left-1/3 text-3xl animate-float-slow" style={{ animationDelay: '4s' }}>√</div>
        <div className="absolute top-1/3 right-1/3 text-4xl animate-float-slow" style={{ animationDelay: '5s' }}>∂</div>
        
        {/* Additional Math Symbols */}
        <div className="absolute top-16 left-1/4 text-5xl animate-float-slow" style={{ animationDelay: '6s' }}>∑</div>
        <div className="absolute top-40 right-1/4 text-4xl animate-float-slow" style={{ animationDelay: '7s' }}>∫</div>
        <div className="absolute bottom-16 right-1/3 text-5xl animate-float-slow" style={{ animationDelay: '8s' }}>π</div>
        <div className="absolute bottom-40 left-1/3 text-4xl animate-float-slow" style={{ animationDelay: '9s' }}>∞</div>
        <div className="absolute top-1/4 right-16 text-3xl animate-float-slow" style={{ animationDelay: '10s' }}>√</div>
        <div className="absolute top-3/4 left-16 text-4xl animate-float-slow" style={{ animationDelay: '11s' }}>∂</div>
      </div>
      
      {/* Dark Center Element */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#191D2A]/40 to-[#191D2A]/80"></div>
      
      {/* Floating Dark Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#191D2A]/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#191D2A]/40 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#191D2A]/50 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 h-full items-start lg:items-center">
          
          {/* Left Column - Hero Section */}
          <motion.div 
            className="md:col-span-2 lg:col-span-1 text-center lg:text-left mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Headline */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white to-[#49E3FF] bg-clip-text text-transparent">
                Compete.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                Learn.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#49E3FF] to-white bg-clip-text text-transparent">
                Win.
              </span>
            </motion.h1>
            
            {/* Subtext Tagline */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl mb-6 text-white/90 font-medium leading-relaxed px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {isLoggedIn 
                ? `Welcome back! Ready to tackle today's math challenges?`
                : 'Join the ultimate math contest platform where students compete, learn, and excel.'
              }
            </motion.p>
            
            {/* CTA Button */}
            <motion.div 
              className="flex justify-center lg:justify-start px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <button 
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#49E3FF] to-[#A146D4] text-[#191D2A] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:ring-offset-2 focus:ring-offset-[#191D2A]"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Login / Register'}
              </button>
            </motion.div>
          </motion.div>

          {/* Center Column - Upcoming Contest */}
          <motion.div 
            id="upcoming-contest"
            className="md:col-span-1 lg:col-span-1 h-[28rem] sm:h-[32rem] mb-6 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {contest ? (
              <div className="relative bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm h-full overflow-hidden">
                {/* Math Symbols Background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 text-2xl">∑</div>
                  <div className="absolute bottom-4 left-4 text-2xl">∫</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">π</div>
                </div>
                <div className="relative z-10 h-full flex flex-col p-4 sm:p-6">
                  {/* Contest Status Badge */}
                  <div className="flex justify-center mb-4">
                    {isLive ? (
                      <span className="bg-gradient-to-r from-[#49E3FF] to-[#A146D4] text-[#191D2A] px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                        🔴 LIVE NOW
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ⏰ Upcoming
                      </span>
                    )}
                  </div>

                  {/* Contest Title */}
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-center">
                    {contest.title}
                  </h3>

                  {/* Contest Description */}
                  <p className="text-[#AEAEAE] text-center mb-4 text-xs sm:text-sm leading-relaxed flex-1">
                    {contest.description}
                  </p>

                  {/* Countdown Timer */}
                  {!isLive ? (
                    <div className="mb-4">
                      <p className="text-center text-[#AEAEAE] mb-3 text-xs sm:text-sm">
                        Contest starts in:
                      </p>
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                          <motion.div 
                            key={unit} 
                            className="text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-1 sm:px-2 py-2 min-w-[40px] sm:min-w-[50px] border border-white/20">
                              <div className="text-sm sm:text-lg font-bold text-[#49E3FF]">
                                {value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs uppercase tracking-wider text-[#AEAEAE]">
                                {unit}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-center text-[#AEAEAE] mb-3 text-xs sm:text-sm">
                        Contest ends in:
                      </p>
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        {Object.entries(timeUntilEnd).map(([unit, value]) => (
                          <motion.div 
                            key={unit} 
                            className="text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-1 sm:px-2 py-2 min-w-[40px] sm:min-w-[50px] border border-red-500/30">
                              <div className="text-sm sm:text-lg font-bold text-red-400">
                                {value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs uppercase tracking-wider text-[#AEAEAE]">
                                {unit}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contest Details */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 text-center">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white">Duration</div>
                      <div className="text-xs text-[#AEAEAE]">{contest.duration || '60 min'}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white">Questions</div>
                      <div className="text-xs text-[#AEAEAE]">{contest.question_count || '25 MCQs'}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center mt-auto pt-4 pb-2">
                    <button
                      onClick={handleButtonClick}
                      className={`w-full px-4 sm:px-6 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#191D2A] ${
                        isLive 
                          ? 'bg-gradient-to-r from-[#49E3FF] to-[#A146D4] text-[#191D2A] hover:shadow-lg hover:shadow-[#49E3FF]/25 focus:ring-[#49E3FF]' 
                          : 'bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white hover:shadow-lg hover:shadow-[#A146D4]/25 focus:ring-[#A146D4]'
                      }`}
                    >
                      {getButtonText()}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="animate-pulse">
                  <div className="h-6 bg-[#A146D4]/20 rounded-lg w-3/4 mx-auto mb-3"></div>
                  <div className="h-4 bg-[#A146D4]/20 rounded-lg w-full mb-4"></div>
                  <div className="h-20 bg-[#A146D4]/20 rounded-lg w-full"></div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Leaderboard Preview */}
          <motion.div 
            id="leaderboard-section"
            className="md:col-span-2 lg:col-span-1 h-[28rem] sm:h-[32rem]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm h-full overflow-hidden">
              {/* Math Symbols Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 text-2xl">∞</div>
                <div className="absolute bottom-4 left-4 text-2xl">√</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">∂</div>
              </div>
              <div className="relative z-10 h-full flex flex-col p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
                  <span className="bg-gradient-to-r from-[#49E3FF] to-[#A146D4] bg-clip-text text-transparent">
                    Top Performers
                  </span>
                </h3>

                {leaderboard && leaderboard.length > 0 ? (
                  <div className="space-y-1 sm:space-y-2 flex-1">
                    {leaderboard.slice(0, 5).map((player, index) => (
                      <motion.div
                        key={player.id}
                        className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {/* Rank */}
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] flex items-center justify-center text-white font-bold text-xs">
                          {getRankIcon(player.rank)}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-xs sm:text-sm truncate">
                            {player.name}
                          </h4>
                          <p className="text-[#AEAEAE] text-xs">
                            {player.school || 'Student'}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent">
                            {player.score}
                          </div>
                          <div className="text-xs text-[#AEAEAE]">
                            {player.accuracy || '95%'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="animate-pulse space-y-2 flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-2">
                        <div className="w-6 h-6 bg-[#A146D4]/20 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-[#A146D4]/20 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-[#A146D4]/20 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-[#A146D4]/20 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* View Full Leaderboard Button */}
                <div className="text-center mt-4 pt-4 pb-2 border-t border-white/10">
                  <button
                    onClick={onViewFullLeaderboard}
                    className="w-full bg-gradient-to-r from-[#49E3FF] to-[#A146D4] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#49E3FF]/25 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:ring-offset-2 focus:ring-offset-[#191D2A]"
                  >
                    View Full Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CombinedHero;
