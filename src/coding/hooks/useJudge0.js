import { useState } from "react";

/**
 * Hook: useJudge0
 * ---------------------------------------------------
 * Executes C code on Judge0 and verifies output.
 * - Uses synchronous `wait=true` mode (no polling)
 * - Compares stdout vs expected output
 * - Displays compiler/runtime/API errors in console output
 * ---------------------------------------------------
 */

export default function useJudge0() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

      if (import.meta.env.VITE_JUDGE0_KEY) {
        headers["X-RapidAPI-Key"] = import.meta.env.VITE_JUDGE0_KEY;
        headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
      }

      // build request body
      const body = {
        language_id: 50,
        source_code: source.source,
        stdin: source.stdin || "",
        compiler_options: "-lm",
      };

      const res = await fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Failed to parse Judge0 response");
      }

      // handle bad response explicitly
      if (!res.ok) {
        const apiError =
          data?.message ||
          data?.error ||
          data?.detail ||
          "Judge0 request failed (invalid code or parameters).";

        const finalResult = {
          output: "",
          error: apiError,
          verdict: 0,
          status: "Bad Request",
          raw: data,
        };

        setResult(finalResult);
        setError(apiError);
        return finalResult;
      }

      const output = data?.stdout ?? "";
      const compileErr = data?.compile_output ?? "";
      const runtimeErr = data?.stderr ?? "";
      const combinedError = compileErr || runtimeErr || "";
      const status = data?.status?.description ?? "Unknown";

      // Compare output to expected (trim both sides)
      let verdict = 0;
      if (source.expectedOutput) {
        verdict = output?.trim() === source.expectedOutput?.trim() ? 1 : 0;
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

      // expose network / unexpected errors to UI
      const userError = err?.message || "Execution failed (network or API error)";
      const failResult = {
        output: "",
        error: userError,
        verdict: 0,
        status: "Error",
        raw: {},
      };

      setError(userError);
      setResult(failResult);
      return failResult;
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, result, error };
}
