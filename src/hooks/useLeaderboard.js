import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

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


export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch leaderboard from Supabase
        const { data, error } = await supabase
          .from('scores')
          .select(`
            score,
            contest_id,
            time_taken,
            users_public!inner(
              name
            )
          `)
          .order('score', { ascending: false })
          .order('time_taken', { ascending: true });

        if (error) {
          throw new Error(`Failed to fetch leaderboard: ${error.message}`);
        }

        // Transform the data to match the expected structure
        const transformedData = data.map((item, index) => ({
          id: index + 1,
          name: item.users_public.name,
          score: item.score,
          rank: index + 1,
          contest_id: item.contest_id,
          time_taken: item.time_taken,
          // Add default values for fields that might not exist in the DB
          school: "N/A",
          level: "Unknown",
          accuracy: "N/A",
          contests_participated: 1,
          avatar: null
        }));

        setLeaderboard(transformedData);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data in case of error
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getTopPlayers = (count = 8) => {
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
      
      // Fetch fresh leaderboard from Supabase
      const { data, error } = await supabase
        .from('scores')
        .select(`
          score,
          contest_id,
          time_taken,
          users_public!inner(
            name
          )
        `)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true });

      if (error) {
        throw new Error(`Failed to refresh leaderboard: ${error.message}`);
      }

      // Transform the data to match the expected structure
      const transformedData = data.map((item, index) => ({
        id: index + 1,
        name: item.users_public.name,
        score: item.score,
        rank: index + 1,
        contest_id: item.contest_id,
        time_taken: item.time_taken,
        // Add default values for fields that might not exist in the DB
        school: "N/A",
        level: "Unknown",
        accuracy: "N/A",
        contests_participated: 1,
        avatar: null
      }));

      setLeaderboard(transformedData);
      
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
