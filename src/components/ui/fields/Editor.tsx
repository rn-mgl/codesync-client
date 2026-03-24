"use client";

import React from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

interface EditorProps {
  ref: React.RefObject<Monaco.editor.IStandaloneCodeEditor | null>;
  boilerPlate: string;
}

const Editor = ({ ref, boilerPlate }: EditorProps) => {
  const editorRef = ref;

  function handleEditorDidMount(editor: Monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      theme="vs-dark"
      language="javascript"
      defaultValue=""
      height="93%"
      value={boilerPlate}
      options={{
        automaticLayout: true,
        codeLens: false,
        colorDecorators: true,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
        "semanticHighlighting.enabled": true,
      }}
    />
  );
};

export default Editor;
