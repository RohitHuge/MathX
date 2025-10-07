import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

// Import components
import CombinedHero from '../../components/landing/CombinedHero';
import HowItWorks from '../../components/landing/HowItWorks';
import AboutCommunity from '../../components/landing/AboutCommunity';
import LandingFooter from '../../components/landing/LandingFooter';
import Loader from '../../components/landing/Loader';
import ErrorModal from '../../components/landing/ErrorModal';
import Toast from '../../components/landing/Toast';
// Sidebar is now handled by ContestLayout

// Import hooks
import { useContests } from '../../hooks/useContests';
import { useLeaderboard } from '../../hooks/useLeaderboard';

const contestLandingPage = () => {
  // Authentication
  const { isAuthenticated, user } = useAuth();
  
  // State management
  const [toast, setToast] = useState({ isVisible: false, type: 'success', title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '', details: '' });

  // API hooks
  const { 
    contests, 
    loading: contestsLoading, 
    error: contestsError, 
    getUpcomingContest, 
    getLiveContest,
    registerForContest 
  } = useContests();

  const { 
    leaderboard, 
    loading: leaderboardLoading, 
    error: leaderboardError, 
    getTopPlayers 
  } = useLeaderboard();

  // Handle errors from API hooks
  useEffect(() => {
    if (contestsError) {
      setErrorModal({
        isOpen: true,
        title: 'Contest Loading Error',
        message: contestsError,
        details: 'Failed to fetch upcoming contests from the server.'
      });
    }
  }, [contestsError]);

  useEffect(() => {
    if (leaderboardError) {
      setErrorModal({
        isOpen: true,
        title: 'Leaderboard Loading Error',
        message: leaderboardError,
        details: 'Failed to fetch leaderboard data from the server.'
      });
    }
  }, [leaderboardError]);

  // Event handlers
  const handleViewContests = () => {
    // Navigate to contests page or scroll to contests section
    const contestsSection = document.getElementById('upcoming-contest');
    if (contestsSection) {
      contestsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback navigation
      window.location.href = '/events';
    }
  };

  const handleLoginRegister = () => {
    // This will be handled by the CombinedHero component's navigation to /auth
    // No need for demo login functionality
  };

  const handleRegisterContest = async (contestId) => {
    try {
      const result = await registerForContest(contestId);
      showToast('success', 'Registration Successful!', result.message);
    } catch (error) {
      showToast('error', 'Registration Failed', error.message);
    }
  };

  const handleViewFullLeaderboard = () => {
    // Navigate to full leaderboard page
    window.location.href = '/leaderboard';
  };

  const handleJoinWhatsApp = () => {
    // Open WhatsApp community link
    window.open('https://wa.me/your-whatsapp-link', '_blank');
    showToast('info', 'WhatsApp Community', 'Opening WhatsApp community link...');
  };

  const showToast = (type, title, message) => {
    setToast({ isVisible: true, type, title, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const closeErrorModal = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }));
  };

  // Get current contest (upcoming or live)
  const currentContest = getLiveContest() || getUpcomingContest();
  const topPlayers = getTopPlayers(5);

  // Loading state
  const isLoading = contestsLoading || leaderboardLoading;

  return (
    <div className="bg-[#191D2A] font-display min-h-screen">
      {/* Main Content Container */}
      <div className="transition-all duration-300">
        {/* Global Loader */}
        {isLoading && (
          <Loader message="Loading contest data..." />
        )}

        {/* Error Modal */}
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={closeErrorModal}
          title={errorModal.title}
          message={errorModal.message}
          details={errorModal.details}
        />

        {/* Toast Notification */}
        <Toast
          isVisible={toast.isVisible}
          onClose={hideToast}
          type={toast.type}
          title={toast.title}
          message={toast.message}
        />

        {/* Main Content */}
        <main>
        {/* Combined Hero Section (Hero + Contest + Leaderboard) */}
        <CombinedHero
          contest={currentContest}
          leaderboard={topPlayers}
          isLoggedIn={isAuthenticated}
          onRegister={handleRegisterContest}
          onLogin={handleLoginRegister}
          onViewContests={handleViewContests}
          onViewFullLeaderboard={handleViewFullLeaderboard}
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* About/Community Section */}
        <AboutCommunity onJoinWhatsApp={handleJoinWhatsApp} />

        {/* Footer */}
        <LandingFooter />
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:ring-offset-2 focus:ring-offset-[#191D2A]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
      </div>
    </div>
  );
};

export default contestLandingPage;
