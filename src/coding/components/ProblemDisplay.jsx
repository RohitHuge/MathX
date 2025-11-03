 import React from "react";

 export default function ProblemDisplay({ problems = [], selectedId, locked = false, onSelect = () => {} }) {
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {problems.map((p) => {
         const pid = p.id ?? p.problem_id;
         const isSelected = selectedId && (selectedId === pid);
         return (
           <div
             key={pid}
             className={`relative rounded-xl border transition-transform duration-200 hover:scale-[1.01] ${
               isSelected ? "border-[#00FFC6] shadow-[0_0_10px_#00FFC6]/40" : "border-[#00FFC6]/30"
             } bg-[#1E293B] text-white p-5`}
           >
             {locked && isSelected && (
               <div className="absolute top-3 right-3 text-xs bg-[#00FFC6] text-black px-2 py-1 rounded-md font-semibold">
                 ✅ Locked
               </div>
             )}
             <h3 className="text-lg font-bold text-[#00FFC6] mb-2">{p.title || p.name || `Problem ${pid}`}</h3>
             <p className="text-gray-300 text-sm line-clamp-3">{p.description || p.summary || "No description available."}</p>
             {p.difficulty && (
               <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-white/10 border border-white/10 text-gray-200">
                 {p.difficulty}
               </span>
             )}
             <div className="mt-4">
               <button
                 disabled={locked}
                 onClick={() => onSelect(p)}
                 className={`px-4 py-2 rounded-md font-semibold transition ${
                   locked
                     ? "opacity-50 cursor-not-allowed bg-gray-600 text-white"
                     : "bg-[#00FFC6] text-black hover:bg-[#00e0b0]"
                 }`}
               >
                 {locked && isSelected ? "Locked" : "Select"}
               </button>
             </div>
           </div>
         );
       })}
     </div>
   );
 }
