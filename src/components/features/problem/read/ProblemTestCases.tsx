import { TestCaseSectionProps } from "@/src/interfaces/problem.interface";
import React from "react";
import { FaXmark } from "react-icons/fa6";

// Renders each test case with its expected output and, once a "test" has been
// submitted, the judge's verdict for that specific test case.
const ProblemTestCases = ({
  testCases,
  submittedTestOutput,
  handleClearSubmissionState,
}: TestCaseSectionProps) => {
  const [selectedTestCase, setSelectedTestCase] = React.useState(
    testCases[0].id ?? 0,
  );

  // Judge verdict for a given test case from the last test submission.
  const judgeResult = (testCaseId: number) =>
    submittedTestOutput?.success
      ? submittedTestOutput.output.judge[testCaseId]
      : null;

  const testCaseSubmissions = Object.fromEntries(
    testCases.map((tc) => {
      const submission = judgeResult(tc.id);
      const submissionOutput =
        submission?.result !== undefined
          ? JSON.stringify(submission.result, null, 2)
          : null;
      const submissionLogs = submission?.logs?.length ? submission.logs : null;
      const isCorrect = submission?.matched === true;
      const submissionError = !submittedTestOutput?.success
        ? submittedTestOutput?.error
        : null;

      return [
        tc.id,
        { submissionOutput, submissionLogs, isCorrect, submissionError },
      ];
    }),
  );

  const mappedTestCases = Object.fromEntries(
    testCases.map((tc) => {
      const mappedInput = Object.entries(tc.input).map(([param, value]) => {
        return (
          <div
            key={param}
            className="p-4 rounded-md bg-neutral-300 text-sm w-full"
          >
            <p className="font-medium text-xs opacity-80">{param}= </p>
            <p className="font-medium mt-1">{JSON.stringify(value, null, 2)}</p>
          </div>
        );
      });

      const { submissionOutput, submissionLogs, isCorrect, submissionError } =
        testCaseSubmissions[tc.id];

      const formattedTestCase = (
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
            <p className="font-medium">{tc.expected_output}</p>
          </div>

          {/* Console logs emitted by the submitted solution. */}
          {submissionLogs && (
            <>
              <p className="text-xs mt-2">Log Output</p>
              <div className="p-4 rounded-md bg-neutral-300 w-full text-sm ">
                <p className="font-medium whitespace-pre-wrap">
                  {submissionLogs
                    .map((log) =>
                      typeof log === "object"
                        ? JSON.stringify(log, null, 2)
                        : log,
                    )
                    .join("\n")}
                </p>
              </div>
            </>
          )}

          {/* Judge output once the solution has been tested on this case. */}
          {(submissionOutput || submissionError) && (
            <>
              <p className="text-xs mt-2">Submission Output</p>
              <div
                className={`p-4 rounded-md min-w-fit w-full text-sm 
                        ${isCorrect ? "bg-green-300 text-green-900" : "bg-danger/20 text-danger"}
                        ${submissionError ? "bg-danger/20 text-danger whitespace-pre-wrap" : ""}`}
              >
                <p className="font-medium">
                  {submissionOutput || submissionError}
                </p>
              </div>
            </>
          )}
        </div>
      );

      return [tc.id, formattedTestCase];
    }),
  );

  const mappedTabs = testCases.map((tc) => {
    const { submissionOutput, isCorrect } = testCaseSubmissions[tc.id];

    return (
      <button
        key={tc.id}
        onClick={() => setSelectedTestCase(tc.id)}
        className={`p-2 rounded-md text-xs font-medium border-2 border-neutral-400 transition-all text-nowrap
                    ${selectedTestCase === tc.id ? (submissionOutput ? "" : "bg-primary text-secondary") : submissionOutput ? "" : "bg-neutral-200"}
                    ${submissionOutput && isCorrect ? "bg-success text-secondary" : submissionOutput && !isCorrect ? "bg-danger text-secondary" : ""}`}
      >
        {submittedTestOutput ? "Submitted Test" : "Test Case"} {tc.id}
      </button>
    );
  });

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2 border p-2 rounded-md border-neutral-400">
      <div className="w-full flex items-start justify-start gap-2 overflow-hidden min-h-fit">
        <div className="w-full flex items-start justify-start gap-2 overflow-x-auto">
          {mappedTabs}
        </div>

        {submittedTestOutput && (
          <button
            title="Clear Test Result"
            onClick={() => handleClearSubmissionState("test")}
            className="p-2 rounded-md border-2 border-neutral-400 hover:text-red-800 bg-neutral-200 animate-fade ml-auto"
          >
            <FaXmark />
          </button>
        )}
      </div>

      <div className="w-full h-auto flex flex-col items-start justify-start gap-2 overflow-y-auto">
        {mappedTestCases[selectedTestCase]}
      </div>
    </div>
  );
};

export default ProblemTestCases;
