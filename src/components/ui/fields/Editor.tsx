"use client";

import React from "react";
import type * as Monaco from "monaco-editor";

const Editor = () => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const currentEditor = editorRef.current;

    if (!currentEditor) return;

    let monacoEditor: Monaco.editor.IStandaloneCodeEditor;
    let cancelled = false;

    // monaco-editor expects it to be client on the dot
    import("monaco-editor").then((monaco) => {
      if (cancelled) return;

      monacoEditor = monaco.editor.create(currentEditor, {
        value: "code here...",
        automaticLayout: true,
        codeLens: false,
        colorDecorators: true,
        fontFamily: "Fira Code",
        theme: "vs-dark",
        minimap: { enabled: false },
      });
    });

    return () => {
      cancelled = true;
      if (monacoEditor) {
        monacoEditor.dispose();
      }
    };
  }, []);

  return <div ref={editorRef} className="w-full h-full rounded-md" />;
};

export default Editor;
