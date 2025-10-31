import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContestStageContext } from "../context/ContestStageContext";
import ContestLandingPage from "./ContestLandingPage";
import ProblemSelectionPage from "./ProblemSelectionPage";
import CodingEnvironmentPage from "./CodingEnvironmentPage";
import LeaderboardPage from "./LeaderboardPage";

export default function StageRouter() {
  const { stageCode, loading } = useContestStageContext();

  const phase = useMemo(() => (stageCode || "")[0]?.toUpperCase(), [stageCode]);

  const renderPage = (p) => {
    switch (p) {
      case "A":
        return <ContestLandingPage />;
      case "B":
        return <ProblemSelectionPage />;
      case "C":
        return <CodingEnvironmentPage />;
      case "D":
        return <LeaderboardPage />;
      default:
        return (
          <div className="flex items-center justify-center h-screen text-gray-400 bg-[#0B1120]">
            Contest not started yet.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-screen text-gray-400 bg-[#0B1120]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00FFC6]"></div>
        Loading contest stage…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase || "_"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderPage(phase)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
