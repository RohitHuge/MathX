import { useState, useEffect } from 'react';

// Mock data for contests
const mockContests = [
  {
    id: 1,
    title: "Weekly Math Challenge",
    description: "Test your mathematical skills with our weekly challenge featuring algebra, geometry, and calculus problems.",
    start_time: new Date('2025-10-09T12:00:00').toISOString(), // September 25, 2025 at 3:10 AM
    duration: "20 minutes",
    question_count: "40 MCQs",
    participant_count: 156,
    difficulty: "Beginner",
    topics: ["Algebra", "Geometry", "Calculus"],
    prize: "Certificate",
    // status: "upcoming"
  },
  // {
  //   id: 2,
  //   title: "Advanced Problem Solving",
  //   description: "For advanced students who want to challenge themselves with complex mathematical problems.",
  //   start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  //   duration: "90 minutes",
  //   question_count: "30 MCQs",
  //   participant_count: 89,
  //   difficulty: "Advanced",
  //   topics: ["Advanced Calculus", "Linear Algebra", "Statistics"],
  //   prize: "Certificate + $200",
  //   status: "upcoming"
  // },
  // {
  //   id: 3,
  //   title: "Quick Math Sprint",
  //   description: "A fast-paced contest with quick mathematical problems to test your speed and accuracy.",
  //   start_time: new Date('2025-09-25T02:30:00').toISOString(), // September 25, 2025 at 2:30 AM
  //   duration: "30 minutes",
  //   question_count: "20 MCQs",
  //   participant_count: 234,
  //   difficulty: "Beginner",
  //   topics: ["Basic Math", "Arithmetic", "Simple Algebra"],
  //   prize: "Certificate",
  //   status: "upcoming"
  // }
];

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await delay(1000);
        
        // Simulate random API failure (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('Failed to fetch contests. Please try again later.');
        }
        
        setContests(mockContests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getUpcomingContest = () => {
    const now = new Date();
    return contests.find(contest => {
      const startTime = new Date(contest.start_time);
      return startTime > now;
    });
  };

  const getLiveContest = () => {
    const now = new Date();
    return contests.find(contest => {
      const startTime = new Date(contest.start_time);
      const durationMinutes = parseInt(contest.duration.replace(/\D/g, '')) || 60; // Extract number from duration string
      const endTime = new Date(startTime.getTime() + (durationMinutes * 60 * 1000));
      return startTime <= now && now <= endTime;
    });
  };

  const registerForContest = async (contestId) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await delay(800);
      
      // Simulate random registration failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Registration failed. Please try again.');
      }
      
      // Update contest participant count
      setContests(prev => prev.map(contest => 
        contest.id === contestId 
          ? { ...contest, participant_count: contest.participant_count + 1 }
          : contest
      ));
      
      return { success: true, message: 'Successfully registered for contest!' };
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contests,
    loading,
    error,
    getUpcomingContest,
    getLiveContest,
    registerForContest
  };
};
