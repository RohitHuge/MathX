import React, { useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, height = "60vh" }) {
  useEffect(() => {
    // Register custom completion suggestions for C language
    loader.init().then((monacoInstance) => {
      monacoInstance.languages.registerCompletionItemProvider("c", {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: "printf",
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'printf("${1:Hello World}\\n");',
              insertTextRules:
                monacoInstance.languages.CompletionItemInsertTextRule
                  .InsertAsSnippet,
              documentation: "Print formatted output to stdout",
            },
            {
              label: "scanf",
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'scanf("%d", &${1:var});',
              insertTextRules:
                monacoInstance.languages.CompletionItemInsertTextRule
                  .InsertAsSnippet,
              documentation: "Read formatted input from stdin",
            },
            {
              label: "main",
              kind: monacoInstance.languages.CompletionItemKind.Snippet,
              insertText: "int main() {\n\t${1:// code}\n\treturn 0;\n}",
              insertTextRules:
                monacoInstance.languages.CompletionItemInsertTextRule
                  .InsertAsSnippet,
              documentation: "Main function entry point",
            },
          ];
          return { suggestions };
        },
      });
    });
  }, []);

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="c"
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          wordBasedSuggestions: true,
          quickSuggestions: true,
          tabCompletion: "on",
        }}
      />
    </div>
  );
}
