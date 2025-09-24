import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Play, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';
import ContestModal from './ContestModal';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle desktop detection and sidebar state
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsOpen(true); // Auto-open on desktop
      } else {
        setIsOpen(false); // Auto-close on mobile
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleAttemptContest = () => {
    if (isAuthenticated) {
      setShowContestModal(true);
    } else {
      navigate('/auth');
    }
    setIsOpen(false);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => scrollToSection('hero-section')
    },
    {
      id: 'upcoming',
      label: 'Upcoming Contest',
      icon: Trophy,
      action: () => scrollToSection('upcoming-contest')
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      action: () => scrollToSection('leaderboard-section')
    },
    {
      id: 'attempt',
      label: 'Attempt Contest',
      icon: Play,
      action: handleAttemptContest
    }
  ];

  return (
    <>
      {/* Menu Button */}
      <motion.button
        className="fixed top-6 left-6 z-50 bg-[#A146D4]/20 backdrop-blur-sm border border-[#A146D4]/30 rounded-lg p-2 text-white hover:bg-[#A146D4]/30 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Sidebar Overlay - Mobile Only */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="sidebar-container fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#191D2A] to-[#191D2A]/95 backdrop-blur-lg border-r border-[#A146D4]/30 z-50"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-[#A146D4]/20">
              <div className="flex items-center justify-between">
                <motion.div
                  className="text-2xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  MathX
                </motion.div>
                {!isDesktop && (
                  <motion.button
                    className="text-[#AEAEAE] hover:text-white transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#A146D4]/20 rounded-lg transition-all duration-200 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5 text-[#49E3FF] group-hover:text-[#A146D4] transition-colors duration-200" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#A146D4]/20">
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#A146D4]/20 rounded-lg transition-all duration-200 group"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-sm text-[#AEAEAE] truncate">{user?.email}</p>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-[#AEAEAE] transition-transform duration-200 ${
                        showProfileDropdown ? 'rotate-180' : ''
                      }`} 
                    />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        className="absolute bottom-full left-0 right-0 mb-2 bg-[#191D2A] border border-[#A146D4]/30 rounded-lg shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.button
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#A146D4]/20 transition-colors duration-200"
                          onClick={() => {
                            navigate('/dashboard');
                            setShowProfileDropdown(false);
                            setIsOpen(false);
                          }}
                          whileHover={{ x: 4 }}
                        >
                          <Settings className="w-4 h-4 text-[#49E3FF]" />
                          <span>Dashboard</span>
                        </motion.button>
                        <motion.button
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-red-500/20 transition-colors duration-200"
                          onClick={handleLogout}
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-[#A146D4]/20 rounded-lg transition-all duration-200 group"
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-5 h-5 text-[#49E3FF] group-hover:text-[#A146D4] transition-colors duration-200" />
                  <span className="font-medium">Login</span>
                </motion.button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Contest Modal */}
      <ContestModal
        isOpen={showContestModal}
        onClose={() => setShowContestModal(false)}
      />
    </>
  );
};

export default Sidebar;
