"use client";

import { SupportedLanguages } from "@/src/interfaces/language.interface";
import {
  RunSummary,
  SubmissionResponse,
  SubmissionStatistics,
} from "@/src/interfaces/submission.interface";
import FailedTestCase from "@/components/features/problem/read/FailedTestCase";
import RunMetricsToggle from "@/components/features/problem/read/RunMetricsToggle";
import RunStatistics from "@/components/features/problem/read/RunStatistics";
import RunStatusBadge from "@/components/features/problem/read/RunStatusBadge";
import SubmittedCodePreview from "@/components/features/problem/read/SubmittedCodePreview";

const RunResults = (props: {
  runOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
    summary: RunSummary | null;
    statistics: SubmissionStatistics | null;
  };
  activeChart: "runtime" | "memory";
  language: SupportedLanguages;
  handleActiveChart: (chart: "runtime" | "memory") => void;
}) => {
  return (
    <div className="flex flex-col items-end justify-start gap-2 w-full">
      {props.runOutput.success ? (
        <div className="p-2 rounded-md bg-neutral-200 flex flex-col items-start justify-start gap-2 w-full">
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
        <div className="p-2 rounded-md bg-danger/20 min-w-fit w-full">
          <p className="text-danger whitespace-pre-line text-sm">
            {props.runOutput.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RunResults;
