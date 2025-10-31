 import React from "react";

 export default function ProblemConfirmModal({ open, problem, round, onConfirm, onCancel }) {
   if (!open || !problem) return null;
   const pid = problem.id ?? problem.problem_id;
   return (
     <div className="fixed inset-0 z-[70]">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
       <div className="absolute inset-0 flex items-center justify-center px-4">
         <div className="w-full max-w-2xl bg-[#1E293B] text-white rounded-xl shadow-lg border border-[#00FFC6]/40 p-6">
           <h2 className="text-xl font-bold text-[#00FFC6]">Confirm Your Choice</h2>
           <p className="text-gray-300 text-sm mt-1">Round {round ?? ""}</p>
           <div className="mt-4 space-y-2">
             <p className="font-semibold">{problem.title || problem.name || `Problem ${pid}`}</p>
             {problem.description && (
               <p className="text-gray-300 text-sm whitespace-pre-wrap">{problem.description}</p>
             )}
             {problem.sample_input && (
               <div className="mt-3">
                 <p className="text-gray-400 text-xs mb-1">Sample Input</p>
                 <pre className="bg-black/30 rounded p-3 text-xs overflow-auto">{problem.sample_input}</pre>
               </div>
             )}
             {problem.sample_output && (
               <div className="mt-3">
                 <p className="text-gray-400 text-xs mb-1">Sample Output</p>
                 <pre className="bg-black/30 rounded p-3 text-xs overflow-auto">{problem.sample_output}</pre>
               </div>
             )}
           </div>
           <div className="mt-6 flex justify-end gap-3">
             <button
               onClick={onCancel}
               className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition"
             >
               Cancel
             </button>
             <button
               onClick={() => onConfirm(pid)}
               className="px-4 py-2 rounded-md bg-[#00FFC6] text-black text-sm font-semibold hover:bg-[#00e0b0] transition"
             >
               Confirm
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }
