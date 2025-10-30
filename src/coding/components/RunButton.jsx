 import React, { useContext } from "react";
 import { FullscreenContext } from "../context/FullscreenContext";

 export default function RunButton({ onRun = () => {} }) {
   const { isFullscreenActive } = useContext(FullscreenContext);

   return (
     <button
       onClick={() => isFullscreenActive && onRun()}
       disabled={!isFullscreenActive}
       className={`px-4 py-2 rounded font-semibold transition ${
         isFullscreenActive
           ? "bg-[#00FFC6] text-black hover:bg-[#00e0b0]"
           : "opacity-50 cursor-not-allowed bg-gray-600 text-white"
       }`}
     >
       ▶ Run
     </button>
   );
 }
