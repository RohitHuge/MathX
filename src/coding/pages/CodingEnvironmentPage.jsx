 import React, { useEffect, useMemo, useState } from "react";
 import ContestLayout from "../layouts/ContestLayout";
 import Timer from "../components/Timer";
 import CodeEditor from "../components/CodeEditor";
 import OutputConsole from "../components/OutputConsole";
 import { useContestStageContext } from "../context/ContestStageContext";
 import { getUserProblem, saveSubmission } from "../utils/supabaseHelpers";
 import useJudge0 from "../hooks/useJudge0";
 import { useAuth } from "../../contexts/AuthContext";
 
 export default function CodingEnvironmentPage() {
   const { round } = useContestStageContext();
   const { user } = useAuth();
   const userId = user?.$id;
 
   const [problem, setProblem] = useState(null);
   const [loadingProblem, setLoadingProblem] = useState(true);
   const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}\n`);
   const [customInput, setCustomInput] = useState("");
   const { loading: running, result, run } = useJudge0();
   const expectedOutput = useMemo(() => problem?.sample_output ?? "", [problem]);
 
   useEffect(() => {
     let mounted = true;
     (async () => {
       if (!userId || !round) { setProblem(null); setLoadingProblem(false); return; }
       setLoadingProblem(true);
       const p = await getUserProblem(userId, Number(round));
       if (mounted) {
         setProblem(p);
         setCustomInput(p?.sample_input ?? "");
         setLoadingProblem(false);
       }
     })();
     return () => { mounted = false; };
   }, [userId, round]);
 
   const handleRun = async () => {
     await run({ source: code, stdin: (customInput ?? problem?.sample_input ?? ""), languageId: 50, expectedOutput });
   };
 
   const handleSubmit = async () => {
     if (!userId || !round || !problem?.problem_id) return;
     const verdict = result?.verdict ?? null;
     const output = result?.output ?? "";
     const res = await saveSubmission(userId, Number(round), problem.problem_id, code, output, verdict);
     if (res?.ok) {
       // simple toast
       alert("✅ Submission saved");
     }
   };
 
   return (
     <ContestLayout>
       <div className="min-h-screen bg-[#0B1120] text-white px-4 md:px-6 py-4">
         <div className="flex items-center justify-between mb-4">
           <Timer />
           <div className="flex items-center gap-2">
             <button
               onClick={handleRun}
               disabled={running || loadingProblem}
               className="px-4 py-2 rounded-md bg-[#00FFC6] text-black font-semibold hover:bg-[#00e0b0] disabled:opacity-50"
             >
               Run
             </button>
             <button
               onClick={handleSubmit}
               disabled={loadingProblem}
               className="px-4 py-2 rounded-md bg-[#00FFC6] text-black font-semibold hover:bg-[#00e0b0] disabled:opacity-50"
             >
               Submit
             </button>
           </div>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Problem Panel */}
           <div className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg p-4">
             {loadingProblem ? (
               <div className="text-gray-300">Loading problem…</div>
             ) : problem ? (
               <div>
                 <h2 className="text-xl font-bold text-[#00FFC6] mb-2">{problem.title}</h2>
                 <p className="text-gray-300 whitespace-pre-wrap mb-4">{problem.description}</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <h3 className="text-sm text-[#00FFC6] font-semibold mb-1">Sample Input</h3>
                     <pre className="text-sm bg-black/30 rounded p-3 overflow-auto max-h-40">{problem.sample_input || ""}</pre>
                   </div>
                   <div>
                     <h3 className="text-sm text-[#00FFC6] font-semibold mb-1">Sample Output</h3>
                     <pre className="text-sm bg-black/30 rounded p-3 overflow-auto max-h-40">{problem.sample_output || ""}</pre>
                   </div>
                 </div>
                 <div className="mt-4">
                   <h3 className="text-sm text-[#00FFC6] font-semibold mb-1">Custom Input</h3>
                   <textarea
                     className="w-full min-h-[100px] bg-black/30 rounded p-3 text-sm text-white border border-[#00FFC6]/20 outline-none focus:border-[#00FFC6]"
                     value={customInput}
                     onChange={(e) => setCustomInput(e.target.value)}
                     placeholder="Type your custom input..."
                   />
                 </div>
               </div>
             ) : (
               <div className="text-gray-300">No problem assigned.</div>
             )}
           </div>
 
           {/* Coding Panel */}
           <div className="flex flex-col gap-4">
             <CodeEditor value={code} onChange={setCode} height="50vh" />
             <OutputConsole
               loading={running}
               output={result?.output}
               error={result?.error}
               verdict={result?.verdict}
             />
           </div>
         </div>
       </div>
     </ContestLayout>
   );
 }
