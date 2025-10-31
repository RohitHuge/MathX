 import { useEffect, useState } from "react";
 import { useContestStageContext } from "../context/ContestStageContext";
 import ContestLayout from "../layouts/ContestLayout";
 import ContestRulesModal from "../components/modals/ContestRulesModal";
 import { getUserChoice } from "../utils/supabaseHelpers";
 import { supabase } from "../../config/supabaseClient";

 export default function ContestLandingPage() {
  const { stageCode, message, round } = useContestStageContext();
  const isWaiting = stageCode?.startsWith("A");
  const [lockedProblem, setLockedProblem] = useState(null);
  const [loadingChoice, setLoadingChoice] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadChoice() {
      if (!isWaiting || !round) { setLockedProblem(null); return; }
      setLoadingChoice(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const uid = auth?.user?.id;
        if (!uid) { setLockedProblem(null); return; }
        const choice = await getUserChoice(uid, Number(round));
        if (mounted) setLockedProblem(choice?.problem ?? null);
      } catch (_) {
        if (mounted) setLockedProblem(null);
      } finally {
        if (mounted) setLoadingChoice(false);
      }
    }
    loadChoice();
    return () => { mounted = false; };
  }, [isWaiting, round]);

  return (
    <ContestLayout>
      {isWaiting && <ContestRulesModal />}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl md:text-8xl font-extrabold text-[#00FFC6] mb-3 shadow-[0_0_10px_#00FFC6]/30">
          MathX
        </h1>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#00FFC6] mb-3 shadow-[0_0_10px_#00FFC6]/30">
          Clash to Code Waiting Room
        </h1>
        <p className="text-gray-300 max-w-lg">{message || "Awaiting next round..."}</p>
        <p className="text-sm text-gray-500 mt-4">Stay focused — fullscreen mode is required!</p>
      </div>
      {isWaiting && (
        <div className="mt-6">
          {lockedProblem ? (
            <div className="p-6 bg-[#1E293B] border border-[#00FFC6]/40 rounded-lg text-center">
              <h2 className="text-[#00FFC6] font-bold text-xl mb-2">Your Selected Problem</h2>
              <p className="text-white font-semibold">{lockedProblem.title}</p>
              {lockedProblem.description && (
                <p className="text-gray-300 text-sm mt-2">{lockedProblem.description}</p>
              )}
              <span className="block text-sm text-gray-400 mt-3">Waiting for next stage…</span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              {loadingChoice ? "Checking your selection..." : "Problem will be assigned automatically."}
            </p>
          )}
        </div>
      )}
    </ContestLayout>
  );
}
