import { useState, useEffect } from 'react';

// Mock data for leaderboard
const mockLeaderboard = [
  {
    id: 1,
    name: "Alex Johnson",
    score: 2450,
    rank: 1,
    school: "MIT",
    level: "Expert",
    accuracy: "98%",
    contests_participated: 15,
    avatar: null
  },
  {
    id: 2,
    name: "Sarah Chen",
    score: 2380,
    rank: 2,
    school: "Stanford",
    level: "Expert",
    accuracy: "96%",
    contests_participated: 12,
    avatar: null
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    score: 2290,
    rank: 3,
    school: "Harvard",
    level: "Advanced",
    accuracy: "94%",
    contests_participated: 18,
    avatar: null
  },
  {
    id: 4,
    name: "Emily Watson",
    score: 2210,
    rank: 4,
    school: "Caltech",
    level: "Advanced",
    accuracy: "92%",
    contests_participated: 14,
    avatar: null
  },
  {
    id: 5,
    name: "David Kim",
    score: 2150,
    rank: 5,
    school: "Berkeley",
    level: "Advanced",
    accuracy: "90%",
    contests_participated: 16,
    avatar: null
  },
  {
    id: 6,
    name: "Lisa Thompson",
    score: 2080,
    rank: 6,
    school: "Yale",
    level: "Intermediate",
    accuracy: "88%",
    contests_participated: 11,
    avatar: null
  },
  {
    id: 7,
    name: "James Wilson",
    score: 2020,
    rank: 7,
    school: "Princeton",
    level: "Intermediate",
    accuracy: "86%",
    contests_participated: 13,
    avatar: null
  },
  {
    id: 8,
    name: "Anna Garcia",
    score: 1950,
    rank: 8,
    school: "Columbia",
    level: "Intermediate",
    accuracy: "84%",
    contests_participated: 10,
    avatar: null
  },
  {
    id: 9,
    name: "Robert Brown",
    score: 1890,
    rank: 9,
    school: "Duke",
    level: "Intermediate",
    accuracy: "82%",
    contests_participated: 9,
    avatar: null
  },
  {
    id: 10,
    name: "Maria Lopez",
    score: 1820,
    rank: 10,
    school: "UCLA",
    level: "Beginner",
    accuracy: "80%",
    contests_participated: 8,
    avatar: null
  }
];

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await delay(1200);
        
        // Simulate random API failure (8% chance)
        if (Math.random() < 0.08) {
          throw new Error('Failed to fetch leaderboard. Please try again later.');
        }
        
        setLeaderboard(mockLeaderboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getTopPlayers = (count = 5) => {
    return leaderboard.slice(0, count);
  };

  const getUserRank = (userId) => {
    return leaderboard.find(player => player.id === userId);
  };

  const getPlayersByLevel = (level) => {
    return leaderboard.filter(player => player.level.toLowerCase() === level.toLowerCase());
  };

  const refreshLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await delay(800);
      
      // Simulate random refresh failure (3% chance)
      if (Math.random() < 0.03) {
        throw new Error('Failed to refresh leaderboard. Please try again.');
      }
      
      // In a real app, this would fetch fresh data from the API
      setLeaderboard([...mockLeaderboard]);
      
      return { success: true, message: 'Leaderboard refreshed successfully!' };
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    loading,
    error,
    getTopPlayers,
    getUserRank,
    getPlayersByLevel,
    refreshLeaderboard
  };
};
