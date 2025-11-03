import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

const rankList = (arr, keys) => {
  const sorted = [...arr].sort((a, b) => {
    for (let key of keys) {
      const dir = key.startsWith("-") ? -1 : 1;
      const field = key.replace("-", "");
      if (a[field] < b[field]) return -1 * dir;
      if (a[field] > b[field]) return 1 * dir;
    }
    return 0;
  });
  return sorted.map((x, i) => ({ ...x, rank: i + 1 }));
};

export default function useLeaderboard(stage) {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOverall = stage === "D0";
  const roundNo =
    !isOverall && stage.startsWith("D")
      ? parseInt(stage.replace("D", ""), 10)
      : null;

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // -------------- 🧩 Common fetch ------------------
      let { data: subs, error: fetchError } = await supabase
        .from("submissions")
        .select(
          "user_id, problem_id, round_no, time_taken, score, status, users_public(name), problems(title)"
        )
        .eq("status", "1");

      if (fetchError) throw fetchError;
      if (!subs || subs.length === 0) {
        setLeaderboardData([]);
        setUserStats(null);
        return;
      }

      // Flatten name + problem
      const formatted = subs.map((s) => ({
        user_id: s.user_id,
        name: s.users_public?.name ?? "User",
        problem: s.problems?.title ?? "Unknown",
        round_no: s.round_no,
        score: s.score ?? 0,
        time_taken: s.time_taken ?? 0,
      }));

      if (isOverall) {
        // -------------- 🧠 Overall Leaderboard ------------------
        const grouped = new Map();
        for (const s of formatted) {
          const key = s.user_id;
          const entry = grouped.get(key) || {
            user_id: key,
            name: s.name,
            total_score: 0,
            total_time: 0,
          };
          entry.total_score += s.score;
          entry.total_time += s.time_taken;
          grouped.set(key, entry);
        }

        const arr = Array.from(grouped.values());
        const ranked = rankList(arr, ["-total_score", "total_time"]);
        setLeaderboardData(ranked);

        // User stats
        const current = ranked.find((r) => r.user_id === user?.$id);
        if (current) {
          setUserStats({
            name: current.name,
            globalRank: current.rank,
            roundRank: "-",
            score: current.total_score,
            timeTaken: current.total_time,
          });
        } else setUserStats(null);
      } else {
        // -------------- 🧠 Round Leaderboard ------------------
        const roundFiltered = formatted.filter((r) => r.round_no === roundNo);
        const rankedByRound = rankList(roundFiltered, ["-score", "time_taken"]);
        setLeaderboardData(rankedByRound);

        const self = rankedByRound.find((r) => r.user_id === user?.$id);
        if (self) {
          // Compute global aggregate as well
          const globalGrouped = new Map();
          for (const s of formatted) {
            const key = s.user_id;
            const entry = globalGrouped.get(key) || {
              user_id: key,
              name: s.name,
              total_score: 0,
              total_time: 0,
            };
            entry.total_score += s.score;
            entry.total_time += s.time_taken;
            globalGrouped.set(key, entry);
          }

          const globalRanked = rankList(
            Array.from(globalGrouped.values()),
            ["-total_score", "total_time"]
          );
          const globalRank =
            globalRanked.find((g) => g.user_id === user?.$id)?.rank || "-";

          setUserStats({
            name: self.name,
            globalRank,
            roundRank: self.rank,
            score: self.score,
            timeTaken: self.time_taken,
          });
        } else setUserStats(null);
      }
    } catch (err) {
      console.error("useLeaderboard fetch error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isOverall, roundNo, user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboardData, userStats, refetch: fetchLeaderboard, loading, error };
}
