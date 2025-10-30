 import React, { useState, useCallback } from "react";
 import LeaderboardBar from "../components/LeaderboardBar";
 import FullscreenGate from "../components/FullscreenGate";
 import { FullscreenContext } from "../context/FullscreenContext";

export default function ContestLayout({ children }) {
  const [isFullscreenActive, setIsFullscreenActive] = useState(!!document.fullscreenElement);
  const handleEntered = useCallback(() => setIsFullscreenActive(true), []);

  return (
    <FullscreenContext.Provider value={{ isFullscreenActive }}>
      <div className="bg-[#191D2A] text-white min-h-screen relative">
        <LeaderboardBar />
        <FullscreenGate onEntered={handleEntered} />
        <div
          className={`pt-14 px-4 md:px-8 transition-opacity ${
            isFullscreenActive ? "opacity-100" : "opacity-40 pointer-events-none"
          }`}
        >
          {children}
        </div>
      </div>
    </FullscreenContext.Provider>
  );
}
