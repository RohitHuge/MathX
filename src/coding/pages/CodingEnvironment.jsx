import React, { useCallback, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import RunButton from "../components/RunButton";
import OutputConsole from "../components/OutputConsole";
// import { runCCode } from "../utils/judge0Client";

const DEFAULT_C_CODE = "#include <stdio.h>\nint main(){\n    printf(\"Hello\\n\");\n    return 0;\n}";

export default function CodingEnvironment() {
  const [code, setCode] = useState(DEFAULT_C_CODE);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const r = await runCCode(code, stdin);
      setResult(r);
    } catch (e) {
      setError(e?.message || "Run failed");
    } finally {
      setLoading(false);
    }
  }, [code, stdin]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">C Coding Sandbox</h1>

      <div className="flex items-center gap-3">
        <RunButton onClick={handleRun} loading={loading} />
        <div className="flex-1" />
      </div>

      <CodeEditor value={code} onChange={setCode} />

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">stdin</label>
        <textarea
          className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Input passed to the program"
        />
      </div>

      {error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <OutputConsole result={result} />
      )}
    </div>
  );
}
