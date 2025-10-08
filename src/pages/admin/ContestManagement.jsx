import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, Databases, Query } from 'appwrite';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Users,
  Clock,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import ContestModal from '../../components/admin/ContestModal';
import QuestionsModal from '../../components/admin/QuestionsModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import Toast from '../../components/landing/Toast';
import { appwriteEndpoint, appwriteProjectId, appwriteDatabaseId } from '../../../config.js';

// Appwrite configuration
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const databases = new Databases(client);

const ContestManagement = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [showContestModal, setShowContestModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [editingContest, setEditingContest] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ 
    isVisible: false, 
    type: 'success', 
    title: '', 
    message: '' 
  });

  // Load contests from Appwrite database
  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch contests from Appwrite database
        const response = await databases.listDocuments(
          appwriteDatabaseId,
          'contest_info',
          [
            Query.orderDesc('$createdAt'),
            Query.limit(100) // Limit to 100 contests to avoid pagination issues
          ]
        );

        // Process contests data
        const processedContests = response.documents.map(contest => ({
          ...contest,
          // Ensure all required fields have default values
          participantCount: contest.participantCount || 1, // Default to 1 for range validation
          questionCount: contest.questionCount || 1, // Default to 1 for range validation
          price: contest.price || 'Free', // Keep as string for flexible pricing
          topics: contest.topics || [],
          eventDuration: contest.eventDuration || 60,
          contestDuration: contest.contestDuration || 30
        }));

        setContests(processedContests);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to fetch contests. Please check your Appwrite configuration.');
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  // Filter and sort contests
  useEffect(() => {
    let filtered = contests.filter(contest => {
      const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contest.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contest.status === statusFilter;
      const matchesDifficulty = difficultyFilter === 'all' || contest.difficulty === difficultyFilter;
      
      return matchesSearch && matchesStatus && matchesDifficulty;
    });

    // Sort contests
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'startTime':
          aValue = new Date(a.startTime);
          bValue = new Date(b.startTime);
          break;
        case 'participantCount':
          aValue = a.participantCount;
          bValue = b.participantCount;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredContests(filtered);
  }, [contests, searchQuery, statusFilter, difficultyFilter, sortBy, sortOrder]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Draft' },
      test: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Test' },
      active: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Active' },
      inactive: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Inactive' },
      deleted: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Deleted' }
    };
    return badges[status] || badges.draft;
  };

  // Get difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      hard: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' }
    };
    return badges[difficulty] || badges.medium;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle contest actions
  const handleAddContest = () => {
    setEditingContest(null);
    setShowContestModal(true);
  };

  const handleEditContest = (contest) => {
    setEditingContest(contest);
    setShowContestModal(true);
  };

  const handleManageQuestions = (contest) => {
    setSelectedContest(contest);
    setShowQuestionsModal(true);
  };

  const handleDeleteContest = (contest) => {
    setSelectedContest(contest);
    setShowDeleteModal(true);
  };

  const handleStatusChange = (contest, newStatus) => {
    setContests(prev => prev.map(c => 
      c.id === contest.id ? { ...c, status: newStatus } : c
    ));
    showToast('success', 'Status Updated', `Contest status changed to ${newStatus}`);
  };

  const handleDeleteConfirm = async () => {
    if (selectedContest) {
      try {
        setLoading(true);
        
        // Delete contest from Appwrite
        await databases.deleteDocument(
          appwriteDatabaseId,
          'contest_info',
          selectedContest.$id
        );

        // Remove from local state
        setContests(prev => prev.filter(c => c.$id !== selectedContest.$id));
        showToast('success', 'Contest Deleted', 'Contest has been permanently deleted');
        setShowDeleteModal(false);
        setSelectedContest(null);
      } catch (err) {
        console.error('Error deleting contest:', err);
        showToast('error', 'Delete Failed', 'Failed to delete contest. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Validation function to ensure only one contest has showInLanding: true
  const validateShowInLanding = async (contestData, isEditing = false, contestId = null) => {
    if (contestData.showInLanding) {
      try {
        // Get all contests to check for existing showInLanding: true
        const allContestsResponse = await databases.listDocuments(
          appwriteDatabaseId,
          'contest_info',
          [
            Query.equal('showInLanding', true),
            Query.limit(100)
          ]
        );

        // Update all contests with showInLanding: true to false
        const updatePromises = allContestsResponse.documents
          .filter(contest => isEditing ? contest.$id !== contestId : true) // Skip current contest if editing
          .map(contest => 
            databases.updateDocument(
              appwriteDatabaseId,
              'contest_info',
              contest.$id,
              { showInLanding: false }
            )
          );

        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
          console.log(`Updated ${updatePromises.length} contests to showInLanding: false`);
        }
      } catch (error) {
        console.error('Error updating other contests:', error);
        // Don't throw error, just log it - the main contest will still be saved
      }
    }
  };

  const handleContestSave = async (contestData) => {
    try {
      setLoading(true);

      // Validate showInLanding field before saving
      await validateShowInLanding(contestData, !!editingContest, editingContest?.$id);

      if (editingContest) {
        // Update existing contest in Appwrite
        await databases.updateDocument(
          appwriteDatabaseId,
          'contest_info',
          editingContest.$id,
          {
            title: contestData.title,
            description: contestData.description,
            startTime: new Date(contestData.startTime).toISOString(),
            eventDuration: contestData.eventDuration,
            contestDuration: contestData.contestDuration,
            status: contestData.status,
            difficulty: contestData.difficulty,
            topics: contestData.topics,
            price: contestData.price, // Keep as string for flexible pricing
            showInLanding: contestData.showInLanding
          }
        );

        // Update local state - also update other contests to showInLanding: false
        setContests(prev => prev.map(c => 
          c.$id === editingContest.$id 
            ? { ...c, ...contestData } 
            : contestData.showInLanding 
              ? { ...c, showInLanding: false }
              : c
        ));
        showToast('success', 'Contest Updated', 'Contest has been successfully updated');
      } else {
        // Create new contest in Appwrite
        const newContest = await databases.createDocument(
          appwriteDatabaseId,
          'contest_info',
          'unique()', // Let Appwrite generate the ID
          {
            title: contestData.title,
            description: contestData.description,
            startTime: new Date(contestData.startTime).toISOString(),
            eventDuration: contestData.eventDuration,
            contestDuration: contestData.contestDuration,
            status: contestData.status,
            difficulty: contestData.difficulty,
            topics: contestData.topics,
            price: contestData.price, // Keep as string for flexible pricing
            showInLanding: contestData.showInLanding,
            participantCount: 1, // Minimum valid value for range 1-10,000
            questionCount: contestData.questionCount || 1 // Minimum valid value for range 1-1,000
          }
        );

        // Add to local state - also update other contests to showInLanding: false if new contest has it true
        setContests(prev => {
          if (contestData.showInLanding) {
            // Update all existing contests to showInLanding: false
            const updatedContests = prev.map(c => ({ ...c, showInLanding: false }));
            return [newContest, ...updatedContests];
          } else {
            return [newContest, ...prev];
          }
        });
        showToast('success', 'Contest Created', 'New contest has been successfully created');
      }
    } catch (err) {
      console.error('Error saving contest:', err);
      showToast('error', 'Save Failed', 'Failed to save contest. Please try again.');
    } finally {
      setLoading(false);
      setShowContestModal(false);
      setEditingContest(null);
    }
  };

  const showToast = (type, title, message) => {
    setToast({ isVisible: true, type, title, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Loading skeleton
  const ContestRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-white/20 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-white/20 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-white/20 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-white/20 rounded w-24"></div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-[#191D2A] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contest Management</h1>
        <p className="text-[#AEAEAE]">Manage contests, questions, and participants</p>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="test">Test</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deleted">Deleted</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF]"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF]"
            >
              <option value="startTime-asc">Start Time (Asc)</option>
              <option value="startTime-desc">Start Time (Desc)</option>
              <option value="participantCount-desc">Participants (High to Low)</option>
              <option value="participantCount-asc">Participants (Low to High)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          {/* Add Contest Button */}
          <motion.button
            onClick={handleAddContest}
            className="bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white px-6 py-2 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Contest</span>
          </motion.button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-medium">Error Loading Contests</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contests Table */}
      <div className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Start Time</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Duration</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Difficulty</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Participants</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => <ContestRowSkeleton key={i} />)
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#AEAEAE]">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <p className="text-lg font-medium text-red-400">Failed to load contests</p>
                    <p className="text-sm">{error}</p>
                  </td>
                </tr>
              ) : filteredContests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#AEAEAE]">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-[#AEAEAE]/50" />
                    <p className="text-lg font-medium">No contests found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredContests.map((contest) => {
                  const statusBadge = getStatusBadge(contest.status);
                  const difficultyBadge = getDifficultyBadge(contest.difficulty);
                  
                  return (
                    <motion.tr
                      key={contest.$id || contest.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{contest.title}</h3>
                            {contest.showInLanding && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[#AEAEAE] text-sm truncate max-w-xs">
                            {contest.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#AEAEAE] text-sm">
                        {formatDate(contest.startTime)}
                      </td>
                      <td className="px-6 py-4 text-[#AEAEAE] text-sm">
                        {contest.eventDuration} min
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${difficultyBadge.bg} ${difficultyBadge.text} ${difficultyBadge.border}`}>
                          {contest.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#AEAEAE] text-sm">
                        {contest.participantCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEditContest(contest)}
                            className="p-2 text-[#49E3FF] hover:bg-[#49E3FF]/20 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Contest"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleManageQuestions(contest)}
                            className="p-2 text-[#A146D4] hover:bg-[#A146D4]/20 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Manage Questions"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDeleteContest(contest)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete Contest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ContestModal
        isOpen={showContestModal}
        onClose={() => {
          setShowContestModal(false);
          setEditingContest(null);
        }}
        onSave={handleContestSave}
        contest={editingContest}
      />

      <QuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => {
          setShowQuestionsModal(false);
          setSelectedContest(null);
        }}
        contest={selectedContest}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedContest(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Contest"
        message={`Are you sure you want to delete "${selectedContest?.title}"? This action cannot be undone.`}
      />

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
};

export default ContestManagement;
