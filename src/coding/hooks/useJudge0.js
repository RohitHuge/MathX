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
      // 🧱 Step 1: Fetch active Judge0 config
      const { data: cfg, error: cfgErr } = await supabase
        .from("judge0_config")
        .select("config")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (cfgErr || !cfg?.config) {
        throw new Error("⚠️ No active Judge0 configuration found in DB");
      }

      const config = cfg.config;
      const url = config.url;
      const headers = config.headers || {};
      const bodyTemplate = config.bodyTemplate || {};

      // 🧩 Step 2: Encode input for base64 endpoints
      const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));

      const body = structuredClone(bodyTemplate);
      body.source_code = toBase64(source);
      body.stdin = toBase64(stdin ?? "");

      console.log("📦 Final Body Sent:", body);

      // 🧩 Step 3: Make API call
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Judge0 API call failed (${res.status})`);

      const data = await res.json();

      // 🧠 Step 4: Decode base64 outputs from VPS
      const fromBase64 = (text) => {
        if (!text) return "";
        try {
          return decodeURIComponent(
            escape(atob(text.replace(/\s/g, "")))
          );
        } catch {
          return text; // fallback if not base64
        }
      };

      const output = fromBase64(data?.stdout) ?? "";
      const compile_output = fromBase64(data?.compile_output) ?? "";
      const runtime_output = fromBase64(data?.stderr) ?? "";
      const combinedError = compile_output || runtime_output || "";
      const status = data?.status?.description ?? "Unknown";

      // 🧩 Step 5: Normalize & compare
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
