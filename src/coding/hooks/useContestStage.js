import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../config/supabaseClient";

function parseStage(stageCode) {
  if (!stageCode || typeof stageCode !== "string") {
    return { phase: undefined, round: undefined };
  }
  const phase = stageCode[0];
  // Special case like D_FINAL: treat as phase 'D' and round 'FINAL'
  if (stageCode.startsWith("D_") && stageCode.includes("FINAL")) {
    return { phase: "D", round: "FINAL" };
  }
  const numMatch = stageCode.match(/(\d+)/);
  const round = numMatch ? Number(numMatch[1]) : undefined;
  return { phase, round };
}

export default function useContestStage() {
  const [loading, setLoading] = useState(true);
  const [stageCode, setStageCode] = useState(undefined);
  const [message, setMessage] = useState("");
  const [roundStart, setRoundStart] = useState(undefined);
  const [roundEnd, setRoundEnd] = useState(undefined);
  const rowIdRef = useRef(null);

  const { phase, round } = useMemo(() => parseStage(stageCode), [stageCode]);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitial() {
      setLoading(true);
      const { data, error } = await supabase
        .from("contest_state")
        .select("*")
        .limit(1)
        .single();
      if (error) {
        console.error("Failed to fetch contest_state:", error);
      } else if (isMounted && data) {
        rowIdRef.current = data.id ?? null;
        setStageCode(data.stage_code ?? data.stageCode ?? undefined);
        setMessage(data.message ?? "");
        setRoundStart(data.round_start_time ?? data.roundStart ?? undefined);
        setRoundEnd(data.round_end_time ?? data.roundEnd ?? undefined);
      }
      if (isMounted) setLoading(false);
    }

    fetchInitial();

    const channel = supabase
      .channel("contest_state")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contest_state" },
        (payload) => {
          const rec = payload.new ?? payload.old ?? {};
          if (rec && typeof rec === "object") {
            console.log("⚡ Realtime contest stage updated:", payload);
            rowIdRef.current = rec.id ?? rowIdRef.current;
            setStageCode(
              (rec.stage_code ?? rec.stageCode ?? stageCode)
            );
            setMessage(rec.message ?? message);
            setRoundStart(
              rec.round_start_time ?? rec.roundStart ?? roundStart
            );
            setRoundEnd(rec.round_end_time ?? rec.roundEnd ?? roundEnd);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Subscribed to contest_state realtime channel");
        }
      });

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // no-op
      }
    };
  }, []);

  const updateStage = async (patchObj) => {
    // Normalize keys to match DB naming (snake_case)
    const payload = { ...patchObj };
    if (payload.stageCode && !payload.stage_code) {
      payload.stage_code = payload.stageCode;
      delete payload.stageCode;
    }
    if (payload.roundStart && !payload.round_start_time) {
      payload.round_start_time = payload.roundStart;
      delete payload.roundStart;
    }
    if (payload.roundEnd && !payload.round_end_time) {
      payload.round_end_time = payload.roundEnd;
      delete payload.roundEnd;
    }

    // Ensure we target the single row
    const id = rowIdRef.current;
    let result;
    if (id != null) {
      result = await supabase
        .from("contest_state")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("contest_state")
        .upsert({ id, ...payload })
        .select()
        .single();
    }

    const { data, error } = result;
    if (error) {
      console.error("Failed to update contest_state:", error);
      throw error;
    }
    // Local optimistic update in case realtime is delayed
    rowIdRef.current = data?.id ?? rowIdRef.current;
    setStageCode(data?.stage_code ?? payload.stage_code ?? stageCode);
    setMessage(data?.message ?? payload.message ?? message);
    setRoundStart(
      data?.round_start_time ?? payload.round_start_time ?? roundStart
    );
    setRoundEnd(data?.round_end_time ?? payload.round_end_time ?? roundEnd);
    return data;
  };

  return {
    stageCode,
    phase,
    round,
    message,
    roundStart,
    roundEnd,
    updateStage,
    loading,
  };
}

export { parseStage };
