"use client";

import { CodeEditorProps } from "@/src/interfaces/field.interface";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

const CodeEditor = ({ ref, boilerPlate, ...props }: CodeEditorProps) => {
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

export default CodeEditor;
