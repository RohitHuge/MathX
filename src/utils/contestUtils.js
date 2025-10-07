/**
 * Contest Utility Functions
 * 
 * This file contains utility functions for contest management,
 * including classification, formatting, and validation.
 */

/**
 * Classifies a contest based on current time and contest timing
 * @param {Object} contest - Contest object with startTime and eventDuration
 * @returns {string} - 'ongoing', 'upcoming', or 'past'
 */
export const classifyContest = (contest) => {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const eventDuration = contest.eventDuration || 60; // Default 60 minutes
  const endTime = new Date(startTime.getTime() + (eventDuration * 60 * 1000));

  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'ongoing';
  } else {
    return 'past';
  }
};

/**
 * Formats date and time for display
 * @param {string} dateString - ISO date string
 * @returns {Object} - Formatted date and time objects
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    fullDate: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    relativeTime: getRelativeTime(date)
  };
};

/**
 * Gets relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date} date - Date object
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((date - now) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 0) {
    // Past time
    if (Math.abs(diffInDays) > 0) {
      return `${Math.abs(diffInDays)} day${Math.abs(diffInDays) > 1 ? 's' : ''} ago`;
    } else if (Math.abs(diffInHours) > 0) {
      return `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) > 1 ? 's' : ''} ago`;
    }
  } else {
    // Future time
    if (diffInDays > 0) {
      return `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
    } else {
      return `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
  }
};

/**
 * Gets difficulty badge styling
 * @param {string} difficulty - Difficulty level
 * @returns {Object} - Tailwind classes for styling
 */
export const getDifficultyStyling = (difficulty) => {
  const styles = {
    easy: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      icon: '🟢'
    },
    medium: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      icon: '🟡'
    },
    hard: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: '🔴'
    }
  };

  return styles[difficulty?.toLowerCase()] || styles.medium;
};

/**
 * Gets status badge styling and text
 * @param {string} classification - Contest classification
 * @returns {Object} - Badge styling and text
 */
export const getStatusBadge = (classification) => {
  const badges = {
    ongoing: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'Ongoing',
      icon: '🟢'
    },
    upcoming: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Upcoming',
      icon: '🔵'
    },
    past: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: 'Ended',
      icon: '⚪'
    }
  };

  return badges[classification] || badges.past;
};

/**
 * Validates contest data
 * @param {Object} contest - Contest object
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateContest = (contest) => {
  const errors = [];

  if (!contest.title || contest.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!contest.description || contest.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!contest.startTime) {
    errors.push('Start time is required');
  } else {
    const startTime = new Date(contest.startTime);
    if (isNaN(startTime.getTime())) {
      errors.push('Invalid start time format');
    }
  }

  if (!contest.eventDuration || contest.eventDuration <= 0) {
    errors.push('Event duration must be greater than 0');
  }

  if (!contest.difficulty || !['easy', 'medium', 'hard'].includes(contest.difficulty.toLowerCase())) {
    errors.push('Difficulty must be easy, medium, or hard');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sorts contests by various criteria
 * @param {Array} contests - Array of contest objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted contests array
 */
export const sortContests = (contests, sortBy) => {
  return [...contests].sort((a, b) => {
    switch (sortBy) {
      case 'startTime':
        return new Date(a.startTime) - new Date(b.startTime);
      case 'participantCount':
        return (b.participantCount || 0) - (a.participantCount || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return (difficultyOrder[a.difficulty?.toLowerCase()] || 2) - 
               (difficultyOrder[b.difficulty?.toLowerCase()] || 2);
      default:
        return 0;
    }
  });
};

/**
 * Filters contests by search query
 * @param {Array} contests - Array of contest objects
 * @param {string} query - Search query
 * @returns {Array} - Filtered contests array
 */
export const filterContests = (contests, query) => {
  if (!query || query.trim().length === 0) {
    return contests;
  }

  const lowercaseQuery = query.toLowerCase();
  return contests.filter(contest => 
    contest.title.toLowerCase().includes(lowercaseQuery) ||
    contest.description.toLowerCase().includes(lowercaseQuery) ||
    (contest.topics && contest.topics.some(topic => 
      topic.toLowerCase().includes(lowercaseQuery)
    ))
  );
};

/**
 * Gets contest statistics
 * @param {Array} contests - Array of contest objects
 * @returns {Object} - Statistics object
 */
export const getContestStats = (contests) => {
  const total = contests.length;
  const ongoing = contests.filter(c => c.classification === 'ongoing').length;
  const upcoming = contests.filter(c => c.classification === 'upcoming').length;
  const past = contests.filter(c => c.classification === 'past').length;
  const totalParticipants = contests.reduce((sum, c) => sum + (c.participantCount || 0), 0);

  return {
    total,
    ongoing,
    upcoming,
    past,
    totalParticipants,
    averageParticipants: total > 0 ? Math.round(totalParticipants / total) : 0
  };
};
