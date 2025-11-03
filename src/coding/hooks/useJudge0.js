import { useState } from "react";
import { supabase } from "../../config/supabaseClient.js";

export default function useJudge0() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function runCCode(source, stdin = "", expectedOutput = "") {
    setLoading(true);
    setError(null);

    try {
      const { data: cfg, error: cfgErr } = await supabase
        .from("judge0_config")
        .select("config")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (cfgErr || !cfg?.config) {
        throw new Error("⚠️ No active Judge0 configuration found in the database");
      }

      const config = cfg.config;
      const url = config.url;
      const headers = config.headers || {};
      const bodyTemplate = config.bodyTemplate || {};

      // 🧩 Step 2: Safely clone bodyTemplate and inject runtime values
const body = structuredClone(bodyTemplate); // modern safe deep copy
body.source_code = source;
body.stdin = stdin ?? "";


      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Judge0 API call failed (${res.status})`);

      const data = await res.json();

      const output = data?.stdout ?? "";
      const compile_output = data?.compile_output ?? "";
      const runtime_output = data?.stderr ?? "";
      const combinedError = compile_output || runtime_output || "";
      const status = data?.status?.description ?? "Unknown";

      function normalizeOutput(s = "") {
        return s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
      }

      let verdict = 0;
      if (expectedOutput) {
        const expected = normalizeOutput(expectedOutput);
        const actual = normalizeOutput(output);
        verdict = expected === actual ? 1 : 0;
      }

      const resultData = {
        output: output || "(no output)",
        error: combinedError,
        verdict,
        status,
        raw: data,
      };

      setResult(resultData);
      return resultData;
    } catch (err) {
      console.error("⚠️ useJudge0 Error:", err);
      setError(err.message || "Unexpected Judge0 error");
      const fallback = {
        output: "",
        error: err.message,
        verdict: 0,
        status: "Error",
        raw: null,
      };
      setResult(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }

  return { runCCode, loading, error, result };
}
