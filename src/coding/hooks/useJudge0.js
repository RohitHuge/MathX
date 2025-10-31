import { useState } from "react";

/**
 * Hook: useJudge0
 * ---------------------------------------------------
 * Executes C code on Judge0 and verifies output.
 * - Uses synchronous `wait=true` mode (no polling)
 * - Compares stdout vs expected output
 * - Handles compiler/runtime errors
 * ---------------------------------------------------
 */

export default function useJudge0() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Run C code and optionally verify output
   * @param {string} source - User's C source code
   * @param {string} stdin - Input to feed to program
   * @param {string} expectedOutput - Optional output to compare for verdict
   */
  async function run(source) {
    setLoading(true);
    setError(null);
    setResult(null);

    const baseUrl = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Optional RapidAPI headers if key is provided
      if (import.meta.env.VITE_JUDGE0_KEY) {
        headers["X-RapidAPI-Key"] = import.meta.env.VITE_JUDGE0_KEY;
        headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
      }
      console.log(source.source);
      console.log(source.stdin);
      console.log(source.expectedOutput);

      const res = await fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          language_id: 50, // C (GCC)
          source_code: source.source,
          stdin : source.stdin,
          compiler_options: "-lm", // link math lib
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Failed to parse Judge0 response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Judge0 request failed");
      }

      const output = data?.stdout ?? "";
      const compileErr = data?.compile_output ?? "";
      const runtimeErr = data?.stderr ?? "";
      const combinedError = compileErr || runtimeErr || "";
      const status = data?.status?.description ?? "Unknown";

      // Compare output to expected (trim both sides)
      let verdict = "";
      if (source.expectedOutput) {
        verdict =
          output?.trim() === source.expectedOutput?.trim()
            ? "✅ Accepted"
            : "❌ Wrong Answer";
      }

      const finalResult = {
        output: output || "(no output)",
        error: combinedError,
        verdict,
        status,
        raw: data,
      };

      setResult(finalResult);
      return finalResult;
    } catch (err) {
      console.error("Judge0 Error:", err);
      setError(err.message || "Execution failed");
      return { error: err.message, verdict: "❌ Error" };
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, result, error };
}
