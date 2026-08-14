import { DetailsPanel } from "@/src/interfaces/problem.interface";
import { SubmissionType } from "@/src/interfaces/submission.interface";
import { FaXmark } from "react-icons/fa6";

// Tabs for the details area. The "Result" tab only appears after a run,
// paired with a button to dismiss it.
const DetailsAction = (props: {
  activeDetailsPanel: DetailsPanel;
  didSubmitRun: boolean;
  handleActiveDetailsPanel: (panel: DetailsPanel) => void;
  handleClearSubmissionState: (type: SubmissionType) => void;
}) => {
  // Reusable tab button that highlights the active panel.
  const tabButton = (panel: DetailsPanel, label: string, extraClass = "") => (
    <button
      onClick={() => props.handleActiveDetailsPanel(panel)}
      className={`text-sm px-2 py-1 border-2 border-neutral-400 rounded-sm ${extraClass} ${
        props.activeDetailsPanel === panel
          ? "bg-primary text-secondary"
          : "bg-neutral-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full min-h-fit flex flex-row items-start justify-start gap-2 overflow-x-auto">
      {tabButton("description", "Description")}
      {tabButton("editorial", "Editorial")}
      {tabButton("submission", "Submission")}

      {props.didSubmitRun && (
        <div className="flex flex-row">
          {tabButton("result", "Result", "border-r rounded-r-none")}
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
