import React from "react";

export default function LeaderboardTable({ data = [], variant = "overall", highlightUserId }) {
  return (
    <div className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-[#00FFC6]/20 flex items-center justify-between">
        <span className="text-sm text-[#00FFC6] font-semibold">
          {variant === "overall" ? "Overall Leaderboard" : "Round Leaderboard"}
        </span>
      </div>
      <div className="overflow-y-auto max-h-[85vh]">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 text-gray-300">
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Name</th>
              {variant === "overall" ? (
                <th className="px-3 py-2">Total Time (s)</th>
              ) : (
                <>
                  <th className="px-3 py-2">Problem</th>
                  <th className="px-3 py-2">Problem Rank</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const isMe = highlightUserId && row.user_id === highlightUserId;
              return (
                <tr
                  key={`${row.user_id}-${idx}`}
                  className={`border-t border-[#00FFC6]/10 hover:bg-[#1E293B]/60 ${isMe ? "border border-[#00FFC6] bg-[#1E293B]/80" : ""}`}
                >
                  <td className="px-3 py-2 text-gray-200">{row.rank ?? row.round_rank ?? idx + 1}</td>
                  <td className="px-3 py-2 text-white">{row.name}</td>
                  {variant === "overall" ? (
                    <td className="px-3 py-2 text-gray-200">{row.total_time}</td>
                  ) : (
                    <>
                      <td className="px-3 py-2 text-gray-200">{row.problem}</td>
                      <td className="px-3 py-2 text-gray-200">{row.problem_rank}</td>
                    </>
                  )}
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={variant === "overall" ? 3 : 4} className="px-3 py-4 text-center text-gray-400">
                  No results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
