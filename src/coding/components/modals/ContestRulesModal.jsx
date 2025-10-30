 import { useEffect, useState } from "react";

export default function ContestRulesModal() {
  const [open, setOpen] = useState(true);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-[#191D2A]/90 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-white rounded-2xl shadow-xl border overflow-hidden bg-gradient-to-br from-[#A146D4]/10 to-[#49E3FF]/10 border-[#A146D4]/30">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#A146D4]/30">
            <h2 className="text-lg md:text-xl font-bold text-white">MathX Contest Rules</h2>
            <button
              type="button"
              className="text-[#AEAEAE] hover:text-white transition"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-[#AEAEAE]">Read carefully before proceeding. Violations may lead to disqualification.</p>
            <ul className="text-sm text-white/90 space-y-2 list-disc pl-5">
              <li>Stay in fullscreen throughout the contest.</li>
              <li>No external assistance, AI tools, or collaboration.</li>
              <li>Do not switch tabs or windows during active rounds.</li>
              <li>Submit solutions before the timer ends. Late submissions are not accepted.</li>
              <li>Any suspicious activity may be audited by admins.</li>
            </ul>
            <div className="bg-white/5 rounded-lg p-3 text-xs text-[#AEAEAE] border border-white/10">
              Keep your device charged and your internet stable. Use modern browsers for the best experience.
            </div>
            <label className="flex items-start gap-3 text-sm text-white/90 select-none">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#49E3FF]"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I have read and agree to the MathX Contest Rules.</span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#A146D4]/30">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              disabled={!agree}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${agree ? "bg-gradient-to-r from-[#A146D4] to-[#49E3FF] text-white hover:shadow-lg" : "bg-white/10 text-white/60 cursor-not-allowed"}`}
              onClick={() => setOpen(false)}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
