"use client";

import React from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

interface IEditor {
  ref: React.RefObject<Monaco.editor.IStandaloneCodeEditor | null>;
}

const Editor = (props: IEditor) => {
  const editorRef = props.ref;

  function handleEditorDidMount(editor: Monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      theme="vs-dark"
      defaultValue="//comment"
      options={{
        automaticLayout: true,
        codeLens: false,
        colorDecorators: true,
        fontFamily: "Fira Code",
        minimap: { enabled: false },
      }}
    />
  );
};

export default Editor;
