import React, { useEffect, useMemo, useState } from "react";
import ContestLayout from "../layouts/ContestLayout";
import Timer from "../components/Timer";
import CodeEditor from "../components/CodeEditor";
import OutputConsole from "../components/OutputConsole";
import { useContestStageContext } from "../context/ContestStageContext";
import { getUserProblem, saveSubmission, getUserSubmissions } from "../utils/supabaseHelpers";
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
  const [submissions, setSubmissions] = useState([]);
  const { loading: running, error, result, runCCode } = useJudge0();
  const expectedOutput = useMemo(() => problem?.sample_output ?? "", [problem]);
  const [showCodingEnvironment, setShowCodingEnvironment] = useState(true);

  // Fetch problem
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId || !round) {
        setProblem(null);
        setLoadingProblem(false);
        return;
      }
      setLoadingProblem(true);
      const p = await getUserProblem(userId, Number(round));
      if (mounted) {
        setProblem(p);
        setCustomInput(p?.sample_input ?? "");
        setLoadingProblem(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId, round]);

  // Fetch submissions
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId || !round) return;
      const subs = await getUserSubmissions(userId, Number(round));
      if (mounted) {
        setSubmissions(subs);
        console.log("Submissions:", subs);
        setShowCodingEnvironment(subs.length === 0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId, round]);

  const handleRun = async () => {
    await runCCode(code, customInput ?? problem?.sample_input ?? "", expectedOutput);
  };

  const handleSubmit = async () => {
    if (!userId || !round || !problem?.problem_id) return;
    const verdict = result?.verdict ?? null;
    const output = result?.output ?? "";
    const res = await saveSubmission(userId, Number(round), problem.problem_id, code, output, verdict);
    if (res?.ok) {
      alert("✅ Submission saved");
      setShowCodingEnvironment(false);
    }
  };

  return (
    <ContestLayout>
      {showCodingEnvironment ? (
        // 🧠 CODING ENVIRONMENT
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
            {/* 🧩 Problem Panel */}
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

            {/* 💻 Coding Panel */}
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
      ) : (
        // 🧾 SUBMISSION SUMMARY VIEW
        <div className="min-h-screen bg-[#0B1120] text-white px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#00FFC6]">Submission Summary</h2>
            <Timer />
          </div>

          {submissions.length > 0 ? (
            submissions.map((sub, idx) => (
              <div
                key={sub.submission_id || idx}
                className="bg-[#1E293B] border border-[#00FFC6]/20 rounded-lg p-4 mb-6"
              >
                <h3 className="text-lg font-semibold text-[#00FFC6] mb-1">
                  Problem: {problem?.title || "N/A"}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Submitted at:{" "}
                  <span className="text-[#00FFC6] font-medium">
                    {new Date(sub.submitted_at).toLocaleString()}
                  </span>
                </p>

                <div className="mb-4">
                  <h4 className="text-sm text-[#00FFC6] font-semibold mb-1">Your Code:</h4>
                  <pre className="bg-black/40 rounded p-3 text-xs text-gray-100 overflow-auto max-h-[300px]">
                    {sub.code}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-black/30 p-3 rounded-md border border-[#00FFC6]/10">
                    <h4 className="text-[#00FFC6] font-semibold mb-1">Output</h4>
                    <pre className="whitespace-pre-wrap text-gray-100">{sub.output || "(no output)"}</pre>
                  </div>
                  <div className="bg-black/30 p-3 rounded-md border border-[#00FFC6]/10">
                    <h4 className="text-[#00FFC6] font-semibold mb-1">Status</h4>
                    <p
                      className={
                        sub.status === "1"
                          ? "text-green-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {sub.status === "1" ? "Accepted ✅" : "Rejected ❌"}
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-md border border-[#00FFC6]/10">
                    <h4 className="text-[#00FFC6] font-semibold mb-1">Round</h4>
                    <p className="text-gray-100">{round}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No submissions found.</div>
          )}
        </div>
      )}
    </ContestLayout>
  );
}
