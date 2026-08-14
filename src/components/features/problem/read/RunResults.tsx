"use client";

import FailedTestCase from "@/components/features/problem/read/FailedTestCase";
import RunMetricsToggle from "@/components/features/problem/read/RunMetricsToggle";
import RunStatistics from "@/components/features/problem/read/RunStatistics";
import RunStatusBadge from "@/components/features/problem/read/RunStatusBadge";
import SubmittedCodePreview from "@/components/features/problem/read/SubmittedCodePreview";
import { SupportedLanguages } from "@/src/interfaces/language.interface";
import { RunSubmissionResult } from "@/src/interfaces/submission.interface";
import { FaLightbulb } from "react-icons/fa6";

// Renders the outcome of a full "run": pass/fail badge, metrics, statistics
// and the submitted code, or the error message when the submission failed.
const RunResults = (props: {
  runOutput: NonNullable<RunSubmissionResult>;
  activeChart: "runtime" | "memory";
  language: SupportedLanguages;
  handleActiveChart: (chart: "runtime" | "memory") => void;
}) => {
  const { runOutput, activeChart, language, handleActiveChart } = props;

  return (
    <div className="flex flex-col items-end justify-start gap-2 w-full">
      {runOutput.success ? (
        <div className="p-2 rounded-md bg-neutral-200 flex flex-col items-start justify-start gap-2 w-full">
          <RunStatusBadge
            passed={runOutput.summary?.passed ?? 0}
            total={runOutput.summary?.total ?? 0}
          />

          {/* On failure only the failing test case is shown. */}
          {runOutput.summary?.failed && runOutput.summary?.failed.testCase ? (
            <FailedTestCase
              testCase={runOutput.summary?.failed.testCase}
              output={runOutput.summary?.failed.output}
            />
          ) : (
            <div className="w-full flex flex-col items-start justify-start gap-2">
              <RunMetricsToggle
                handleActiveChart={handleActiveChart}
                activeChart={activeChart}
                memory={runOutput.summary?.memory ?? 0}
                runtime={runOutput.summary?.runtime ?? 0}
              />

              {runOutput.statistics && (
                <RunStatistics
                  activeChart={activeChart}
                  statistics={runOutput.statistics}
                />
              )}

              {/* Submitted code, echoed back by the judge for analysis. */}
              {runOutput.summary?.code && (
                <div className="w-full flex flex-col gap-2 items-end">
                  <button
                    className="text-sm p-2 rounded-md bg-info t:w-fit t:px-4 font-medium 
                          text-secondary flex flex-row gap-2 items-center justify-center"
                  >
                    <span>Analyze</span>
                    <FaLightbulb />
                  </button>
                  <SubmittedCodePreview
                    code={runOutput.summary.code}
                    language={runOutput.summary?.language ?? language}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Submission failed: the reducer stored an error string.
        <div className="p-2 rounded-md bg-danger/20 min-w-fit w-full">
          <p className="text-danger whitespace-pre-line text-sm">
            {runOutput.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RunResults;
