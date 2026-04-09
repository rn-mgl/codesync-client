import { TestCaseSectionProps } from "@/src/interfaces/problem.interface";
import React from "react";

const ProblemTestCases = (props: TestCaseSectionProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndex = (index: number) => {
    setTabIndex(index);
  };

  const mappedTestCases = props.testCases.map((tc) => {
    const mappedInput = Object.entries(tc.input).map(([param, value]) => {
      const parsedValue: string = JSON.stringify(value, null, 2);

      return (
        <div
          key={param}
          className="p-4 rounded-md bg-neutral-300 text-sm w-full"
        >
          <p className="font-medium text-xs opacity-80">{param}= </p>
          <p className="font-medium mt-1">{parsedValue}</p>
        </div>
      );
    });

    const matchingSubmissionOutput =
      props.submittedTestOutput &&
      props.submittedTestOutput.success &&
      JSON.stringify(props.submittedTestOutput.output[tc.id].result, null, 2);

    const isCorrectSubmissionOutput =
      props.submittedTestOutput &&
      props.submittedTestOutput.success &&
      props.submittedTestOutput.output[tc.id].matched;

    const matchingSubmissionError =
      props.submittedTestOutput &&
      !props.submittedTestOutput.success &&
      props.submittedTestOutput.error;

    return (
      <div
        key={tc.id}
        className="w-full h-auto flex flex-col items-start justify-start gap-2 p-2 rounded-md bg-neutral-200"
      >
        <p className="text-xs">Input</p>
        <div className="w-full flex flex-col items-center justify-start gap-2">
          {mappedInput}
        </div>

        <p className="text-xs mt-2">Expected Output</p>
        <div className="p-4 rounded-md bg-neutral-300 w-full text-sm">
          <p className="font-medium">
            {JSON.stringify(tc.expected_output, null, 2)}
          </p>
        </div>

        {(matchingSubmissionOutput || matchingSubmissionError) && (
          <>
            <p className="text-xs mt-2">Submission Output</p>
            <div
              className={`p-4 rounded-md min-w-fit w-full text-sm 
                        ${isCorrectSubmissionOutput ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"}
                        ${matchingSubmissionError ? "bg-red-300 text-red-900" : ""}`}
            >
              <p className="font-medium">
                {matchingSubmissionOutput || matchingSubmissionError}
              </p>
            </div>
          </>
        )}
      </div>
    );
  });

  const mappedTabs = mappedTestCases.map((_, index) => {
    return (
      <button
        key={index}
        onClick={() => handleTabIndex(index)}
        className={`p-2 rounded-md text-xs font-medium border-2 border-neutral-400 transition-all text-nowrap
                    ${tabIndex === index ? "bg-primary text-secondary" : "bg-neutral-200"}`}
      >
        {props.submittedTestOutput ? "Submitted Test" : "Test Case"} {index + 1}
      </button>
    );
  });

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2 border p-2 rounded-md border-neutral-400">
      <div className="w-full flex items-start justify-start gap-2 overflow-x-auto overflow-y-hidden min-h-fit">
        {mappedTabs}
      </div>

      <div className="w-full h-auto flex flex-col items-start justify-start gap-2 overflow-y-auto">
        {mappedTestCases[tabIndex]}
      </div>
    </div>
  );
};

export default ProblemTestCases;
