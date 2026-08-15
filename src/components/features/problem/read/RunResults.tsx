"use client";

import FailedTestCase from "@/components/features/problem/read/FailedTestCase";
import RunMetricsToggle from "@/components/features/problem/read/RunMetricsToggle";
import RunStatistics from "@/components/features/problem/read/RunStatistics";
import RunStatusBadge from "@/components/features/problem/read/RunStatusBadge";
import SubmittedCodePreview from "@/components/features/problem/read/SubmittedCodePreview";
import { SupportedLanguages } from "@/src/interfaces/language.interface";
import { RunSubmissionResult } from "@/src/interfaces/submission.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import React from "react";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaWandMagicSparkles,
  FaXmark,
} from "react-icons/fa6";

// Renders the outcome of a full "run": pass/fail badge, metrics, statistics
// and the submitted code, or the error message when the submission failed.
const RunResults = (props: {
  runOutput: NonNullable<RunSubmissionResult>;
  activeChart: "runtime" | "memory";
  language: SupportedLanguages;
  openedSubmission: number;
  handleActiveChart: (chart: "runtime" | "memory") => void;
}) => {
  const [analysis, setAnalysis] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const {
    runOutput,
    activeChart,
    language,
    openedSubmission,
    handleActiveChart,
  } = props;

  const clearAnalysis = () => {
    setAnalysis("");
  };

  const analyze = async () => {
    try {
      if (!openedSubmission) {
        return;
      }

      setLoading(true);

      const request = {
        action: "analyze_code",
        id: openedSubmission,
      };

      const response = await fetch(`/api/open-cody`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request }),
      });

      const resolve = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      setAnalysis(resolve.data.response);
    } catch (error) {
      errorToast(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end justify-start gap-2 w-full">
      {runOutput.success ? (
        <div className="p-2 rounded-md bg-neutral-200 flex flex-col items-start justify-start gap-2 w-full">
          <div className="w-full flex flex-col justify-between gap-2 t:flex-row ">
            <RunStatusBadge
              passed={runOutput.summary?.passed ?? 0}
              total={runOutput.summary?.total ?? 0}
            />

            {openedSubmission && (
              <button
                onClick={analyze}
                disabled={loading}
                className="text-xs p-2 rounded-md bg-linear-to-br from bg-info/50 to-accent/80 text-secondary t:w-fit t:px-4 font-medium 
                          flex flex-row gap-2 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span>Analyzing...</span>
                    <FaWandMagicSparkles className="animate-pulse" />
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <FaWandMagicSparkles />
                  </>
                )}
              </button>
            )}
          </div>

          {analysis && (
            <div className="p-6 rounded-md bg-secondary w-full relative text-sm whitespace-pre-wrap animate-fade border-2 border-neutral-400">
              <button
                onClick={clearAnalysis}
                className="text-xs p-2 rounded-full absolute top-2 right-2"
              >
                <FaXmark />
              </button>
              <FaQuoteLeft className="absolute top-2 left-2" />
              {analysis}
              <FaQuoteRight className="absolute bottom-2 right-2" />
            </div>
          )}

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

      {/* Submitted code, echoed back by the judge for analysis. */}
      {runOutput.summary?.code && (
        <div className="w-full flex flex-col gap-2 items-end">
          <SubmittedCodePreview
            code={runOutput.summary.code}
            language={runOutput.summary?.language ?? language}
          />
        </div>
      )}
    </div>
  );
};

export default RunResults;
