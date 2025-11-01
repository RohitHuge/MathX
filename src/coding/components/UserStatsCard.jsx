import React from "react";

export default function UserStatsCard({ stats }) {
  const s = stats || {};
  return (
    <div className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#00FFC6] font-semibold">Your Performance</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-black/20 rounded p-3">
          <div className="text-gray-400">👤 User</div>
          <div className="text-white font-semibold">{s.name ?? "-"}</div>
        </div>
        <div className="bg-black/20 rounded p-3">
          <div className="text-gray-400">🌍 Global Rank</div>
          <div className="text-white font-semibold">{s.globalRank ?? "-"}</div>
        </div>
        <div className="bg-black/20 rounded p-3">
          <div className="text-gray-400">🎯 Round Rank</div>
          <div className="text-white font-semibold">{s.roundRank ?? "-"}</div>
        </div>
        <div className="bg-black/20 rounded p-3">
          <div className="text-gray-400">📘 Problem Rank</div>
          <div className="text-white font-semibold">{s.problemRank ?? "-"}</div>
        </div>
        <div className="bg-black/20 rounded p-3 col-span-2">
          <div className="text-gray-400">⏱ Time Taken (s)</div>
          <div className="text-white font-semibold">{s.timeTaken ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}
