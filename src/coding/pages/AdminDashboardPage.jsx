import { useEffect, useMemo, useState } from "react";
import { useContestStageContext } from "../context/ContestStageContext.jsx";

const STAGE_OPTIONS = [
  "A0",
  "A1",
  "B1",
  "C1",
  "D1",
  "A2",
  "B2",
  "C2",
  "D2",
  "D_FINAL",
];

function Toast({ text, onClose, duration = 2000 }) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);
  return (
    <div style={{
      position: "fixed",
      top: 16,
      right: 16,
      background: "#111",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 8,
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      zIndex: 1000,
      fontSize: 14,
    }}>
      {text}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stageCode, message, updateStage, loading } = useContestStageContext();
  const [selectedStage, setSelectedStage] = useState("A0");
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (stageCode) setSelectedStage(stageCode);
  }, [stageCode]);

  useEffect(() => {
    setMsg(message ?? "");
  }, [message]);

  const canSubmit = useMemo(() => !!selectedStage, [selectedStage]);

  const handleUpdate = async () => {
    if (!canSubmit) return;
    try {
      await updateStage({ stage_code: selectedStage, message: msg });
      console.log("Stage updated to", selectedStage);
      setToast(`Stage updated to ${selectedStage} successfully`);
    } catch (e) {
      console.error(e);
      setToast("Failed to update stage");
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Admin Dashboard</h2>

      <div style={{
        padding: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        marginBottom: 16,
        background: "#fafafa",
      }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>
          <strong>Current Stage:</strong> {stageCode ?? "-"}
        </div>
        <div style={{ fontSize: 14 }}>
          <strong>Current Message:</strong> {message ?? "-"}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#374151" }}>Stage Code</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
            }}
          >
            {STAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#374151" }}>Message</span>
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Announcement or instructions"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
            }}
          />
        </label>

        <button
          disabled={!canSubmit || loading}
          onClick={handleUpdate}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: (!canSubmit || loading) ? "#9ca3af" : "#111827",
            color: "white",
            border: "none",
            cursor: (!canSubmit || loading) ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Updating..." : "Update Stage"}
        </button>
      </div>

      {toast && (
        <Toast text={toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
