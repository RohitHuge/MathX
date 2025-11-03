 import React from "react";
 import useContestTimer from "../hooks/useContestTimer";

 export default function Timer() {
   const { minutes, seconds, remaining } = useContestTimer();
   const mm = String(minutes || 0).padStart(2, "0");
   const ss = String(seconds || 0).padStart(2, "0");
   return (
     <div className={`px-3 py-1 rounded-md border text-[#00FFC6] border-[#00FFC6]/30 bg-white/5 ${remaining <= 10000 ? "animate-pulse" : ""}`}>
       <span className="font-mono font-semibold">{mm}:{ss}</span>
     </div>
   );
 }
