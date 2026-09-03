import { SubmissionType } from "@/src/interfaces/submission.interface";
import React from "react";

// Buttons under the editor: "Test" runs against the sample cases,
// "Run" executes the full suite and shows statistics.
const EditorActions = (props: {
  submitting: SubmissionType | null;
  handleSubmission: (type: SubmissionType) => void;
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-2 t:justify-end mt-2">
      <button
        onClick={() => props.handleSubmission("test")}
        type="button"
        disabled={props.submitting !== null}
        className="w-full p-1 rounded-md font-bold bg-neutral-200 t:max-w-16 t:px-4 text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Test
      </button>

      <button
        onClick={() => props.handleSubmission("run")}
        type="button"
        disabled={props.submitting !== null}
        className="w-full p-1 rounded-md font-bold bg-accent text-secondary t:max-w-16 t:px-4 text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Run
      </button>
    </div>
  );
};

export default EditorActions;