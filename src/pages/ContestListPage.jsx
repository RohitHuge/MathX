import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Client, Databases, Query } from 'appwrite';
import {
  Trophy,
  Clock,
  Users,
  Calendar,
  Play,
  Eye,
  ChevronRight,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../config.js';
import {
  classifyContest,
  formatDateTime,
  getDifficultyStyling,
  getStatusBadge,
  sortContests,
  filterContests
} from '../utils/contestUtils';

// Appwrite configuration
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const databases = new Databases(client);

const ContestListPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State management
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('startTime');

  // Contest classification utility (now imported from utils)

  // Fetch contests from Appwrite
  const fetchContests = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      // console.log(user);
      // console.log(`user label: ${user.labels[0]}`);

      // Fetch contests from Appwrite database
      if (user && user.labels && (user.labels[0] == 'mvp' || user.labels[0] === 'admin')) {
        response = await databases.listDocuments(
          appwriteDatabaseId, // Replace with your database ID
          'contest_info', // Replace with your collection ID
          [
            Query.notEqual('status', 'deleted'),
            Query.notEqual('status', 'draft'),
            Query.orderDesc('$createdAt')
          ]
        );

      } else {
        response = await databases.listDocuments(
          appwriteDatabaseId, // Replace with your database ID
          'contest_info', // Replace with your collection ID
          [
            Query.notEqual('status', 'deleted'),
            Query.notEqual('status', 'draft'),
            Query.notEqual('status', 'test'),
            Query.orderDesc('$createdAt')
          ]
        );

      }

      // Process and classify contests
      const processedContests = response.documents.map(contest => ({
        ...contest,
        classification: classifyContest(contest)
      }));

      setContests(processedContests);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError('Failed to fetch contests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // No real-time updates - users can refresh manually for updates

  // Initial data fetch
  useEffect(() => {
    fetchContests();
  }, []);

  // Filter and sort contests
  useEffect(() => {
    let filtered = contests.filter(contest => {
      const matchesTab = contest.classification === activeTab;
      return matchesTab;
    });

    // Apply search filter
    filtered = filterContests(filtered, searchQuery);

    // Sort contests
    filtered = sortContests(filtered, sortBy);

    setFilteredContests(filtered);
  }, [contests, activeTab, searchQuery, sortBy]);

  // Get status badge component
  const getStatusBadgeComponent = (contest) => {
    const classification = contest.classification;
    const badge = getStatusBadge(classification);

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} border ${badge.border}`}>
        {classification === 'ongoing' ? (
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
        ) : classification === 'upcoming' ? (
          <Clock className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {badge.label}
      </span>
    );
  };

  // Handle contest action
  const handleContestAction = (contest) => {
    // Check for guest access first
    if (contest.auth_required === false) {
      navigate(`/contest/guest/${contest.$id}`);
      return;
    }

    if (contest.classification === 'ongoing' || contest.classification === 'upcoming') {
      navigate(`/contest/${contest.$id}`);
    } else {
      navigate(`/contest/${contest.$id}/results`);
    }
  };

  // Loading skeleton
  const ContestSkeleton = () => (
    <div className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-white/20 rounded-lg mb-2 w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-white/20 rounded-full"></div>
      </div>
      <div className="h-4 bg-white/10 rounded mb-4 w-full"></div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="h-4 w-20 bg-white/10 rounded"></div>
          <div className="h-4 w-16 bg-white/10 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-white/20 rounded-lg"></div>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = ({ type }) => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-[#A146D4]/20 to-[#49E3FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-8 h-8 text-[#AEAEAE]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No {type} contests found
      </h3>
      <p className="text-[#AEAEAE] mb-6">
        {type === 'ongoing'
          ? "There are no contests running at the moment. Check back later!"
          : type === 'upcoming'
            ? "No upcoming contests scheduled. Stay tuned for new challenges!"
            : "No past contests available to view."
        }
      </p>
      {type === 'upcoming' && (
        <button
          onClick={() => navigate('/contest')}
          className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200"
        >
          View All Contests
        </button>
      )}
    </motion.div>
  );

  const tabs = [
    { id: 'ongoing', label: 'Ongoing', icon: Play, count: contests.filter(c => c.classification === 'ongoing').length },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: contests.filter(c => c.classification === 'upcoming').length },
    { id: 'past', label: 'Past', icon: Trophy, count: contests.filter(c => c.classification === 'past').length }
  ];

  return (
    <div className="min-h-screen bg-[#191D2A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10 border-b border-[#A146D4]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contest Hub</h1>
              <p className="text-[#AEAEAE]">Discover and participate in math contests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
              <input
                type="text"
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF]"
              >
                <option value="startTime">Sort by Date</option>
                <option value="participantCount">Sort by Participants</option>
                <option value="title">Sort by Title</option>
              </select>
              <motion.button
                onClick={fetchContests}
                disabled={loading}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Refresh contests"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white'
                    : 'bg-white/5 text-[#AEAEAE] hover:bg-white/10 hover:text-white'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                    ? 'bg-white/20'
                    : 'bg-white/10'
                    }`}>
                    {tab.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 mt-1">{error}</p>
            <button
              onClick={fetchContests}
              className="mt-2 text-red-400 hover:text-red-300 underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ContestSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Contest Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {filteredContests.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredContests.map((contest, index) => {
                  const { date, time } = formatDateTime(contest.startTime);

                  return (
                    <motion.div
                      key={contest.$id}
                      className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#49E3FF]/10 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#49E3FF] transition-colors duration-200">
                            {contest.title}
                          </h3>
                          <p className="text-[#AEAEAE] text-sm line-clamp-2">
                            {contest.description?.substring(0, 100)}
                            {contest.description?.length > 100 && '...'}
                          </p>
                        </div>
                        {getStatusBadgeComponent(contest)}
                      </div>

                      {/* Contest Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-[#49E3FF]" />
                            <span className="text-[#AEAEAE] text-sm">Start Time</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm font-medium">{date}</p>
                            <p className="text-[#AEAEAE] text-xs">{time}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-[#A146D4]" />
                            <span className="text-[#AEAEAE] text-sm">Duration</span>
                          </div>
                          <span className="text-white text-sm font-medium">
                            {contest.eventDuration || 60} minutes
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-[#49E3FF]" />
                            <span className="text-[#AEAEAE] text-sm">Participants</span>
                          </div>
                          <span className="text-white text-sm font-medium">
                            {contest.participantCount || 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#AEAEAE] text-sm">Difficulty</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyStyling(contest.difficulty).bg} ${getDifficultyStyling(contest.difficulty).text} ${getDifficultyStyling(contest.difficulty).border}`}>
                            {contest.difficulty || 'Medium'}
                          </span>
                        </div>
                      </div>

                      {/* Topics */}
                      {contest.topics && contest.topics.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-1">
                            {contest.topics.slice(0, 3).map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-2 py-1 bg-[#A146D4]/20 text-[#A146D4] rounded-full text-xs border border-[#A146D4]/30"
                              >
                                {topic}
                              </span>
                            ))}
                            {contest.topics.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 text-[#AEAEAE] rounded-full text-xs">
                                +{contest.topics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <motion.button
                        onClick={() => handleContestAction(contest)}
                        className="w-full bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-2 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center justify-center space-x-2 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {contest.classification === 'past' ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>View Results</span>
                          </>
                        ) : !isAuthenticated ? (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Login to participate</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Join Contest</span>
                          </>
                        )}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ContestListPage;
