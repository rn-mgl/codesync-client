import { SubmissionType } from "@/src/interfaces/submission.interface";
import { FaXmark } from "react-icons/fa6";

const DetailsAction = (props: {
  activeDetailsPanel: "description" | "editorial" | "submission";
  didSubmitRun: boolean;
  handleActiveDetailsPanel: (
    panel: "description" | "editorial" | "submission",
  ) => void;
  handleClearSubmissionState: (type: SubmissionType) => void;
}) => {
  return (
    <div className="w-full min-h-fit flex flex-row items-start justify-start gap-2 overflow-x-auto">
      <button
        onClick={() => props.handleActiveDetailsPanel("description")}
        className={`text-sm px-2 py-1 border-2 border-neutral-400 rounded-sm ${props.activeDetailsPanel === "description" ? "bg-primary text-secondary" : "bg-neutral-200"}`}
      >
        Description
      </button>
      <button
        onClick={() => props.handleActiveDetailsPanel("editorial")}
        className={`text-sm px-2 py-1 border-2 border-neutral-400 rounded-sm ${props.activeDetailsPanel === "editorial" ? "bg-primary text-secondary" : "bg-neutral-200"}`}
      >
        Editorial
      </button>

      {props.didSubmitRun && (
        <div className="flex flex-row">
          <button
            onClick={() => props.handleActiveDetailsPanel("submission")}
            className={`text-sm px-2 py-1 border-2 border-r rounded-r-none border-neutral-400 rounded-sm ${props.activeDetailsPanel === "submission" ? "bg-primary text-secondary" : "bg-neutral-200"}`}
          >
            Submission
          </button>

          <button
            onClick={() => props.handleClearSubmissionState("run")}
            className="text-sm px-2 py-1 border-2 border-l rounded-l-none border-neutral-400 rounded-sm bg-neutral-200"
          >
            <FaXmark />
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsAction;
