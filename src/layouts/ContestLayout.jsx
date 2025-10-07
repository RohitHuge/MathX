import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Play, 
  User, 
  ChevronDown,
  LogOut,
  Settings,
  List,
  Calendar,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import ContestModal from '../components/navigation/ContestModal';

const ContestLayout = ({ children }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Always open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close profile dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowProfileDropdown(false);
        if (isMobile) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      navigate('/contest');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAttemptContest = () => {
    if (isAuthenticated) {
      setShowContestModal(true);
    } else {
      navigate('/auth');
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/contest',
      action: () => navigate('/contest')
    },
    {
      id: 'contests',
      label: 'All Contests',
      icon: List,
      path: '/contests',
      action: () => navigate('/contests')
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Settings,
      path: '/dashboard',
      action: () => navigate('/dashboard')
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: BarChart3,
      path: '/leaderboard',
      action: () => navigate('/leaderboard')
    },
    {
      id: 'attempt',
      label: 'Attempt Contest',
      icon: Play,
      action: handleAttemptContest
    }
  ];

  const getCurrentPath = () => {
    return location.pathname;
  };

  const isActiveRoute = (path) => {
    return getCurrentPath() === path;
  };

  return (
    <div className="min-h-screen bg-[#191D2A] flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          className="fixed top-4 left-4 z-50 bg-[#A146D4] text-white p-2 rounded-lg shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isMobile && sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#191D2A] to-[#191D2A]/95 backdrop-blur-lg border-r border-[#A146D4]/30 z-50 ${
          isMobile ? 'transform transition-transform duration-300' : ''
        }`}
        initial={isMobile ? { x: -320 } : { x: 0 }}
        animate={{ x: sidebarOpen ? 0 : (isMobile ? -320 : 0) }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#A146D4]/20">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-[#A146D4] to-[#49E3FF] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            MathX
          </motion.div>
          <p className="text-[#AEAEAE] text-sm mt-1">Contest Platform</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            
            return (
              <motion.button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A146D4]/30 to-[#49E3FF]/30 text-white border border-[#A146D4]/50'
                    : 'text-white hover:bg-[#A146D4]/20'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${
                  isActive 
                    ? 'text-[#49E3FF]' 
                    : 'text-[#49E3FF] group-hover:text-[#A146D4]'
                }`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-[#49E3FF] rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
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
              onClick={() => navigate('/auth')}
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

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-80'
      }`}>
        <div className="min-h-screen">
          {children}
        </div>
      </div>

      {/* Contest Modal */}
      <ContestModal
        isOpen={showContestModal}
        onClose={() => setShowContestModal(false)}
      />
    </div>
  );
};

export default ContestLayout;
