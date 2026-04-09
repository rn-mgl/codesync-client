import { SubmissionType } from "@/src/interfaces/submission.interface";
import React from "react";

const EditorActions = (props: {
  handleSubmission: (type: SubmissionType) => void;
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2 t:justify-end mt-2">
      <button
        onClick={() => props.handleSubmission("test")}
        type="button"
        className="w-full p-1 rounded-md font-bold bg-neutral-200 t:max-w-16 t:px-4 text-sm"
      >
        Test
      </button>

      <button
        onClick={() => props.handleSubmission("run")}
        type="button"
        className="w-full p-1 rounded-md font-bold bg-green-600 text-secondary t:max-w-16 t:px-4 text-sm"
      >
        Run
      </button>
    </div>
  );
};

export default EditorActions;
