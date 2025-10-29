import React from "react";

export default function OutputConsole({ result }) {
  const stdout = result?.stdout ?? "";
  const stderr = result?.stderr ?? result?.compile_output ?? "";
  const status = result?.status?.description ?? "";

  return (
    <div className="mt-4 grid gap-3">
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">stdout</div>
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-auto max-h-60 whitespace-pre-wrap">{stdout || ""}</pre>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">stderr</div>
        <pre className="bg-gray-900 text-red-300 p-3 rounded-md overflow-auto max-h-60 whitespace-pre-wrap">{stderr || ""}</pre>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">status</div>
        <div className="bg-gray-100 p-2 rounded-md text-gray-800">{status || ""}</div>
      </div>
    </div>
  );
}
