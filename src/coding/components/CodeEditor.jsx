 import React from "react";
 import Editor from "@monaco-editor/react";

 export default function CodeEditor({ value, onChange, height = "50vh" }) {
   return (
     <div className="rounded-lg overflow-hidden border border-[#00FFC6]/20 bg-[#1E293B]">
       <Editor
         height={height}
         theme="vs-dark"
         defaultLanguage="c"
         language="c"
         value={value}
         onChange={(v) => onChange?.(v ?? "")}
         options={{
           wordWrap: "on",
           minimap: { enabled: false },
           fontSize: 14,
           automaticLayout: true,
           scrollBeyondLastLine: false,
         }}
       />
     </div>
   );
 }
