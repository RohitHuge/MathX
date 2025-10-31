import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { getProblemsByRound, getUserChoice, saveUserChoice } from "../utils/supabaseHelpers";
import { useAuth } from "../../contexts/AuthContext";

export default function useProblemSelection(round) {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const roundNo = useMemo(() => Number(round) || null, [round]);

  useEffect(() => {
    let active = true;
    async function init() {
      if (!roundNo) { setLoading(false); return; }
      setLoading(true);
      try {
        // load available problems
        const list = await getProblemsByRound(roundNo);
        if (active) setProblems(Array.isArray(list) ? list : []);

        // load existing choice
        const userId = user?.$id;
        if (userId) {
          const choice = await getUserChoice(userId, roundNo);
          if (choice?.problem) {
            if (active) {
              setSelectedProblem(choice.problem);
              setLocked(true);
            }
          }
        }
      } catch (e) {
        console.error("useProblemSelection init error:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, [roundNo]);

  const selectProblem = (problem) => {
    if (locked) return; // no-op if already locked
    setSelectedProblem(problem);
  };

  const confirmSelection = async (problemId) => {
    // console.log("Confirming selection...");
    if (!roundNo || !problemId) return { ok: false, error: "Invalid data" };
    try {
      const userId = user?.$id;
      console.log("User:", user);
      console.log("User ID:", userId);
      if (!userId) return { ok: false, error: "Not authenticated" };
      const res = await saveUserChoice(userId, roundNo, problemId);
      console.log("Save result:", res);
      if (res?.ok) {
        const chosen = problems.find((p) => p.id === problemId || p.problem_id === problemId);
        if (chosen) setSelectedProblem(chosen);
        setLocked(true);
        return { ok: true };
      }
      return { ok: false, error: res?.error || "Failed to save choice" };
    } catch (e) {
      console.error("confirmSelection error", e);
      return { ok: false, error: String(e?.message || e) };
    }
  };

  return { problems, selectedProblem, loading, selectProblem, confirmSelection, locked };
}
