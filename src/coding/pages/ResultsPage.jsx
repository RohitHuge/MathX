import React, { useMemo } from "react";
import ContestLayout from "../layouts/ContestLayout";
import { useContestStageContext } from "../context/ContestStageContext";
import useLeaderboard from "../hooks/useLeaderboard";
import LeaderboardTable from "../components/LeaderboardTable";
import UserStatsCard from "../components/UserStatsCard";
import { useAuth } from "../../contexts/AuthContext";

export default function ResultsPage() {
  const { stageCode, round, message } = useContestStageContext();
  const { user } = useAuth();
  const userId = user?.$id;
  const { leaderboardData, userStats, refetch, loading } = useLeaderboard(stageCode, userId);

  const isOverall = stageCode === "D0";

  const title = useMemo(() => {
    if (isOverall) return "🏆 Overall Leaderboard";
    return `🏆 Round ${round ?? "-"} Leaderboard (Stage ${stageCode || "-"})`;
  }, [isOverall, round, stageCode]);

  return (
    <ContestLayout>
      <div className="min-h-screen bg-[#0B1120] text-white px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-[#00FFC6]">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#00FFC6] text-black font-semibold hover:bg-[#00e0b0] disabled:opacity-50"
            >
              ⟳ Refresh Results
            </button>
          </div>
        </div>

        {isOverall ? (
          <div className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg p-4">
            <LeaderboardTable data={leaderboardData} variant="overall" highlightUserId={userId} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserStatsCard stats={userStats} />
            <LeaderboardTable data={leaderboardData} variant="round" highlightUserId={userId} />
          </div>
        )}

        {message && (
          <div className="mt-6 text-sm text-gray-400">{message}</div>
        )}
      </div>
    </ContestLayout>
  );
}
