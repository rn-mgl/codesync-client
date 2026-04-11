import { SupportedLanguages } from "@/src/interfaces/language.interface";
import CodeEditor from "@/src/components/ui/fields/CodeEditor";
import React from "react";
import * as Monaco from "monaco-editor";

const SubmittedCodePreview = (props: {
  code: string;
  language: SupportedLanguages;
}) => {
  const readonlyEditor =
    React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  return (
    <div className="w-full p-2 rounded-md bg-[#1e1e1e] text-secondary max-h-80 resize-y h-full min-h-72">
      <CodeEditor
        ref={readonlyEditor}
        boilerPlate={props.code}
        language={props.language}
        readOnly={true}
      />
    </div>
  );
};

export default SubmittedCodePreview;
