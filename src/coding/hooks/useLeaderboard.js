import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

// Utility to rank items by a numeric field
const rankList = (arr, key) =>
  arr
    .sort((a, b) => a[key] - b[key])
    .map((item, index) => ({ ...item, rank: index + 1 }));

export default function useLeaderboard(stage) {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOverall = stage === "D0";
  const roundNo = !isOverall && stage.startsWith("D")
    ? parseInt(stage.replace("D", ""), 10)
    : null;

  // --- FETCH FUNCTION ---
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isOverall) {
        // ==========================================
        // 🏆 D0 — Overall Leaderboard
        // ==========================================
        const { data: subs, error } = await supabase
          .from("submissions")
          .select("user_id, time_taken, status, users_public(name)");

        if (error) throw error;

        const accepted = (subs || []).filter((s) => String(s.status) === "1");

        // Group by user and sum total time
        const grouped = new Map();
        for (const s of accepted) {
          const key = s.user_id;
          const name = s.users_public?.name ?? "User";
          const entry = grouped.get(key) || { user_id: key, name, total_time: 0 };
          entry.total_time += Number(s.time_taken || 0);
          grouped.set(key, entry);
        }

        const arr = Array.from(grouped.values());
        const ranked = rankList(arr, "total_time");
        setLeaderboardData(ranked);
        setUserStats(null);
      } else {
        // ==========================================
        // 🧩 D1+ — Round Leaderboard + User Stats
        // ==========================================
        const { data: subs, error } = await supabase
          .from("submissions")
          .select(
            "user_id, round_no, problem_id, time_taken, status, users_public(name), problems(title)"
          )
          .eq("round_no", roundNo);

        if (error) throw error;

        const accepted = (subs || []).filter((s) => String(s.status) === "1");

        // Group user submissions per problem
        const grouped = new Map();
        for (const s of accepted) {
          const key = s.user_id;
          const name = user?.name ?? "User";
          const problem = s.problems?.title ?? "Unknown";
          const entry =
            grouped.get(key) || {
              user_id: key,
              name,
              problem,
              time_taken: 0,
              problem_rank: 0,
              round_rank: 0,
              global_rank: 0,
            };
          entry.time_taken += Number(s.time_taken || 0);
          grouped.set(key, entry);
        }

        const arr = Array.from(grouped.values());
        const rankedByRound = rankList(arr, "time_taken");
        setLeaderboardData(rankedByRound);

        // Find current user's stats
        if (user) {
          const self = rankedByRound.find((r) => r.user_id === user.$id);
          if (self) {
            // Compute global rank (across all rounds)
            const { data: globalSubs, error: globalErr } = await supabase
              .from("submissions")
              .select("user_id, time_taken, status, users_public(name)");
            if (globalErr) throw globalErr;

            const acceptedGlobal = (globalSubs || []).filter(
              (s) => String(s.status) === "1"
            );
            const globalGrouped = new Map();
            for (const s of acceptedGlobal) {
              const key = s.user_id;
              const name = user?.name ?? "User";
              const entry =
                globalGrouped.get(key) || { user_id: key, name, total_time: 0 };
              entry.total_time += Number(s.time_taken || 0);
              globalGrouped.set(key, entry);
            }
            const globalRanked = rankList(
              Array.from(globalGrouped.values()),
              "total_time"
            );
            const globalRank =
              globalRanked.find((g) => g.user_id === user.$id)?.rank || "-";

            setUserStats({
              name: self.name,
              globalRank,
              roundRank: self.rank,
              problemRank: self.problem_rank || "-",
              timeTaken: self.time_taken,
            });
          } else {
            setUserStats(null);
          }
        } else {
          setUserStats(null);
        }
      }
    } catch (err) {
      console.error("useLeaderboard fetch error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isOverall, roundNo, user]);

  // --- INITIAL + MANUAL REFRESH ---
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboardData, userStats, refetch: fetchLeaderboard, loading, error };
}
