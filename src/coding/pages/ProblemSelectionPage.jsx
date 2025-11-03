import React, { useState } from "react";
import { useContestStageContext } from "../context/ContestStageContext";
import useProblemSelection from "../hooks/useProblemSelection";
import ProblemDisplay from "../components/ProblemDisplay";
import ProblemConfirmModal from "../components/modals/ProblemConfirmModal";
import ContestLayout from "../layouts/ContestLayout";

export default function ProblemSelectionPage() {
  const { stageCode, round } = useContestStageContext();
  const { problems, selectedProblem, loading, selectProblem, confirmSelection, locked } = useProblemSelection(round);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);

  const handleSelect = (p) => {
    if (locked) return;
    selectProblem(p);
    setPending(p);
    setConfirmOpen(true);
  };

  const handleConfirm = async (pid) => {
    const res = await confirmSelection(pid);
    setConfirmOpen(false);
    setPending(null);
    // optional toast: handled by parent if needed
  };

  return (
    <ContestLayout>
      <div className="min-h-[70vh] py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#00FFC6]">Problem Selection</h1>
          <p className="text-gray-300 text-sm mt-1">Round {round ?? "-"}</p>
        </div>

        {loading ? (
          <div className="text-gray-300">Loading problems...</div>
        ) : selectedProblem ? (
          <div className="p-6 bg-[#1E293B] border border-[#00FFC6]/40 rounded-lg text-center">
            <h2 className="text-[#00FFC6] font-bold text-xl mb-2">Your Selected Problem</h2>
            <p className="text-white font-semibold">{selectedProblem.title}</p>
            <p className="text-gray-300 text-sm mt-2">{selectedProblem.description}</p>
            <span className="block text-sm text-gray-400 mt-3">Waiting for next stage…</span>
          </div>
        ) : (
          <ProblemDisplay
            problems={problems}
            selectedId={selectedProblem?.id ?? selectedProblem?.problem_id}
            locked={!!locked}
            onSelect={handleSelect}
          />
        )}
      </div>

      <ProblemConfirmModal
        open={confirmOpen}
        problem={pending}
        round={round}
        onConfirm={handleConfirm}
        onCancel={() => { setConfirmOpen(false); setPending(null); }}
      />
    </ContestLayout>
  );
}

 
