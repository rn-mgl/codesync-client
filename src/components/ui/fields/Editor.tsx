"use client";

import React from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { EditorProps } from "@/src/interfaces/problem.interface";

const Editor = ({ ref, boilerPlate, ...props }: EditorProps) => {
  const editorRef = ref;

  function handleEditorDidMount(editor: Monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      theme="vs-dark"
      defaultValue="/* processing code... */"
      height="93%"
      value={boilerPlate}
      language={props.language}
      options={{
        automaticLayout: true,
        codeLens: false,
        colorDecorators: true,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
        "semanticHighlighting.enabled": true,
        readOnly: props.readOnly ?? false,
      }}
    />
  );
};

export default Editor;
