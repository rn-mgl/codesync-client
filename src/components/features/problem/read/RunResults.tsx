"use client";

import { SupportedLanguages } from "@/src/interfaces/language.interface";
import {
  RunSummary,
  SubmissionResponse,
  SubmissionStatistics,
  SubmissionType,
} from "@/src/interfaces/submission.interface";
import { FaXmark } from "react-icons/fa6";
import FailedTestCase from "./FailedTestCase";
import RunMetricsToggle from "./RunMetricsToggle";
import RunStatistics from "./RunStatistics";
import RunStatusBadge from "./RunStatusBadge";
import SubmittedCodePreview from "./SubmittedCodePreview";

const RunResults = (props: {
  runOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
    summary: RunSummary | null;
    statistics: SubmissionStatistics | null;
  };
  handleClearSubmissionState: (type: SubmissionType) => void;
  handleActiveChart: (chart: "runtime" | "memory") => void;
  activeChart: "runtime" | "memory";
  language: SupportedLanguages;
}) => {
  return (
    <div className="flex flex-col items-end justify-start gap-2 w-full">
      <button
        title="Clear Run Result"
        onClick={() => props.handleClearSubmissionState("run")}
        className="p-2 rounded-full hover:text-red-800 bg-secondary animate-fade flex flex-row items-center justify-center text-sm"
      >
        <FaXmark />
      </button>

      {props.runOutput.success ? (
        <div className="p-2 rounded-md bg-neutral-red-300 flex flex-col items-start justify-start gap-2 w-full">
          <RunStatusBadge
            passed={props.runOutput.summary?.passed ?? 0}
            total={props.runOutput.summary?.total ?? 0}
          />

          {props.runOutput.summary?.failed &&
          props.runOutput.summary?.failed.testCase ? (
            <FailedTestCase
              testCase={props.runOutput.summary?.failed.testCase}
              output={props.runOutput.summary?.failed.output}
            />
          ) : (
            <div className="w-full flex flex-col items-start justify-start gap-2">
              <RunMetricsToggle
                handleActiveChart={props.handleActiveChart}
                activeChart={props.activeChart}
                memory={props.runOutput.summary?.memory ?? 0}
                runtime={props.runOutput.summary?.runtime ?? 0}
              />

              {props.runOutput.statistics && (
                <RunStatistics
                  activeChart={props.activeChart}
                  statistics={props.runOutput.statistics}
                />
              )}

              {props.runOutput.summary?.code && (
                <SubmittedCodePreview
                  code={props.runOutput.summary.code}
                  language={props.runOutput.summary?.language ?? props.language}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 rounded-md bg-red-300 min-w-fit w-full">
          <p className="text-red-900 whitespace-pre-line text-sm">
            {props.runOutput.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RunResults;
