import { useState } from 'react';
import { supabase } from '../config/supabaseClient';

export const useContestScore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get user's existing score record for a contest
   * @param {string} contestId - The contest ID
   * @param {string} userId - The Appwrite user ID
   * @returns {Promise<Object|null>} The score record if exists, null otherwise
   */
  const getUserContestScore = async (contestId, userId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('contest_id', contestId)
        .eq('user_id', userId);

      if (error) throw error;
      if (!data || data.length === 0) return null;
      return data[0];

    } catch (err) {
      console.error('Error fetching contest score:', err);
      setError('Failed to fetch contest score');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start a new contest attempt
   * @param {string} contestId - The contest ID
   * @param {string} userId - The Appwrite user ID
   * @returns {Promise<Object|null>} The created score record
   */
  const startContest = async (contestId, userId) => {
    try {
      setLoading(true);
      setError(null);

      const existingScore = await getUserContestScore(contestId, userId);
      if (existingScore) {
        throw new Error('Contest already started');
      }

      const { data, error } = await supabase
          .from('scores')
          .insert([
            {
              contest_id: contestId,
              user_id: userId,
              start_time: new Date().toISOString()
            }
          ])
          .select();

        if (error) throw error;

        const newRecord = Array.isArray(data) ? data[0] : data;
        return newRecord;

      // if (error) throw error;
      // console.log('Contest started:', data);
      // return data;
    } catch (err) {
      console.error('Error starting contest:', err);
      setError('Failed to start contest');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit final contest score
   * @param {string} contestId - The contest ID
   * @param {string} userId - The Appwrite user ID
   * @param {number} score - The final score
   * @returns {Promise<Object|null>} The updated score record
   */
  const submitContest = async (contestId, userId, score) => {
    try {
      setLoading(true);
      setError(null);

      // First check if the score record exists
      const existingScore = await getUserContestScore(contestId, userId);
      if (!existingScore) {
        throw new Error('No active contest session found');
      }

      const { data, error } = await supabase
        .from('scores')
        .update({
          end_time: new Date().toISOString(),
          score: score
        })
        .eq('contest_id', contestId)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to update contest score');
      }

      console.log('Contest submitted:', data);
      return data;
    } catch (err) {
      console.error('Error submitting contest:', err);
      setError('Failed to submit contest score');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getUserContestScore,
    startContest,
    submitContest
  };
};