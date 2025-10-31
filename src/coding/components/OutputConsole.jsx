 import React, { useEffect, useRef } from "react";

 export default function OutputConsole({ loading, output = "", error = "", verdict = null }) {
   const ref = useRef(null);

   useEffect(() => {
     if (ref.current) {
       ref.current.scrollTop = ref.current.scrollHeight;
     }
   }, [output, error, verdict, loading]);

   return (
     <div className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg overflow-hidden">
       <div className="px-4 py-2 border-b border-[#00FFC6]/20 flex items-center justify-between">
         <span className="text-sm text-[#00FFC6] font-semibold">Output</span>
         {verdict && (
           <span className={`text-sm font-bold ${
             verdict === "Accepted" ? "text-emerald-400" : "text-red-400"
           }`}>
             {verdict === "Accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
           </span>
         )}
       </div>
       <div ref={ref} className="p-4 max-h-56 overflow-auto text-sm text-gray-200 font-mono">
         {loading && (
           <div className="flex items-center gap-2 text-gray-300">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00FFC6]"></div>
             Running code…
           </div>
         )}
         {!loading && error && (
           <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>
         )}
         {!loading && !error && (
           <pre className="whitespace-pre-wrap">{output || ""}</pre>
         )}
       </div>
     </div>
   );
 }
