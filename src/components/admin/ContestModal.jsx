import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Calendar, Clock, Users, DollarSign, Tag } from 'lucide-react';

const ContestModal = ({ isOpen, onClose, onSave, contest }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    eventDuration: 60,
    contestDuration: 30,
    difficulty: 'medium',
    topics: '',
    price: 'Free',
    questionCount: 1,
    status: 'draft',
    showInLanding: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when contest prop changes
  useEffect(() => {
    if (contest) {
      setFormData({
        title: contest.title || '',
        description: contest.description || '',
        startTime: contest.startTime ? new Date(contest.startTime).toLocaleString('sv-SE').slice(0, 16) : '',
        eventDuration: contest.eventDuration || 60,
        contestDuration: contest.contestDuration || 30,
        difficulty: contest.difficulty || 'medium',
        topics: contest.topics ? (Array.isArray(contest.topics) ? contest.topics.join(', ') : contest.topics) : '',
        price: contest.price || 'Free',
        questionCount: contest.questionCount || 1,
        status: contest.status || 'draft',
        showInLanding: contest.showInLanding || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '',
        eventDuration: 60,
        contestDuration: 30,
        difficulty: 'medium',
        topics: '',
        price: 'Free',
        questionCount: 1,
        status: 'draft',
        showInLanding: false
      });
    }
    setErrors({});
  }, [contest, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (formData.eventDuration <= 0) {
      newErrors.eventDuration = 'Event duration must be greater than 0';
    }

    if (formData.contestDuration <= 0) {
      newErrors.contestDuration = 'Contest duration must be greater than 0';
    }

    if (formData.contestDuration > formData.eventDuration) {
      newErrors.contestDuration = 'Contest duration cannot be longer than event duration';
    }

    if (formData.questionCount < 1) {
      newErrors.questionCount = 'Question count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const contestData = {
        ...formData,
        topics: formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic),
        participantCount: contest?.participantCount || 0,
        questionCount: contest?.questionCount || 0
      };

      onSave(contestData);
    } catch (error) {
      console.error('Error saving contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border border-[#A146D4]/30 rounded-2xl backdrop-blur-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {contest ? 'Edit Contest' : 'Add New Contest'}
                </h2>
                <p className="text-[#AEAEAE] text-sm">
                  {contest ? 'Update contest details' : 'Create a new math contest'}
                </p>
              </div>
              <motion.button
                onClick={handleClose}
                disabled={loading}
                className="text-[#AEAEAE] hover:text-white transition-colors duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Contest Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter contest title"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent resize-none"
                  placeholder="Describe the contest..."
                  disabled={loading}
                />
              </div>

              {/* Start Time and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                        errors.startTime ? 'border-red-500' : 'border-white/10'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.startTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Event Duration (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                    <input
                      type="number"
                      min="1"
                      value={formData.eventDuration}
                      onChange={(e) => handleInputChange('eventDuration', parseInt(e.target.value) || 0)}
                      className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                        errors.eventDuration ? 'border-red-500' : 'border-white/10'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.eventDuration && (
                    <p className="text-red-400 text-sm mt-1">{errors.eventDuration}</p>
                  )}
                </div>
              </div>

              {/* Contest Duration and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Contest Duration (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                    <input
                      type="number"
                      min="1"
                      value={formData.contestDuration}
                      onChange={(e) => handleInputChange('contestDuration', parseInt(e.target.value) || 0)}
                      className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                        errors.contestDuration ? 'border-red-500' : 'border-white/10'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.contestDuration && (
                    <p className="text-red-400 text-sm mt-1">{errors.contestDuration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Topics and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Topics
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                    <input
                      type="text"
                      value={formData.topics}
                      onChange={(e) => handleInputChange('topics', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                      placeholder="Algebra, Geometry, Calculus"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[#AEAEAE] text-xs mt-1">Separate topics with commas</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Price/Reward
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#AEAEAE] focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                      placeholder="Free, $10, Trophy, Certificate, etc."
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[#AEAEAE] text-xs mt-1">Enter price, reward, or trophy</p>
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Question Count
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AEAEAE] w-4 h-4" />
                  <input
                    type="number"
                    min="1"
                    value={formData.questionCount}
                    onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value) || 1)}
                    className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent ${
                      errors.questionCount ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="Number of questions"
                    disabled={loading}
                  />
                </div>
                {errors.questionCount && (
                  <p className="text-red-400 text-sm mt-1">{errors.questionCount}</p>
                )}
                <p className="text-[#AEAEAE] text-xs mt-1">Total number of questions in this contest</p>
              </div>

              {/* Show in Landing Page */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInLanding}
                    onChange={(e) => handleInputChange('showInLanding', e.target.checked)}
                    className="w-4 h-4 text-[#49E3FF] bg-white/5 border-white/10 rounded focus:ring-[#49E3FF] focus:ring-2"
                    disabled={loading}
                  />
                  <div>
                    <span className="text-white font-medium">Show on Landing Page</span>
                    <p className="text-[#AEAEAE] text-xs">Display this contest on the main landing page</p>
                    {formData.showInLanding && (
                      <p className="text-yellow-400 text-xs mt-1">
                        ⚠️ This will remove the "Featured" status from all other contests
                      </p>
                    )}
                  </div>
                </label>
              </div>

              {/* Status */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#49E3FF] focus:border-transparent"
                  disabled={loading}
                >
                  <option value="draft">Draft</option>
                  <option value="test">Test</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-white/10">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white py-3 px-4 rounded-lg font-medium hover:from-[#A146D4]/90 hover:to-[#49E3FF]/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{contest ? 'Update Contest' : 'Create Contest'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContestModal;
