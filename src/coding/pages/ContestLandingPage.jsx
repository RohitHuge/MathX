 import { useEffect, useState } from "react";
import { useContestStageContext } from "../context/ContestStageContext";
import ContestLayout from "../layouts/ContestLayout";
import ContestRulesModal from "../components/modals/ContestRulesModal";
import { getUserChoice } from "../utils/supabaseHelpers";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function ContestLandingPage() {
  const { message, round } = useContestStageContext();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loadingChoice, setLoadingChoice] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    async function loadChoice() {
      if (!round) { setSelectedProblem(null); return; }
      setLoadingChoice(true);
      try {
        const uid = user?.$id;
        if (!uid) { setSelectedProblem(null); return; }
        const choice = await getUserChoice(uid, Number(round));
        console.log("Choice:", choice);
        if (mounted) setSelectedProblem(choice?.problem ?? null);
      } catch (_) {
        if (mounted) setSelectedProblem(null);
      } finally {
        if (mounted) setLoadingChoice(false);
      }
    }
    loadChoice();
    return () => { mounted = false; };
  }, [round]);

  return (
    <ContestLayout>
      <ContestRulesModal />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-8xl md:text-6xl font-bold text-[#00FFC6] mb-3">MathX</h1>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#00FFC6] mb-3">
          🏁 Clash of Code Waiting Room
        </h1>
        <p className="text-gray-300 mb-4">{message || "Awaiting next round…"}</p>

        {selectedProblem && (
          <div className="mt-6 p-5 bg-[#1E293B] border border-[#00FFC6]/30 rounded-lg w-[90%] md:w-[60%]">
            <h3 className="text-[#00FFC6] font-semibold mb-2">Your Selected Problem</h3>
            <p className="text-white font-bold">{selectedProblem.title}</p>
            <p className="text-gray-300 text-sm">{selectedProblem.description}</p>
          </div>
        )}
      </div>
    </ContestLayout>
  );
}
