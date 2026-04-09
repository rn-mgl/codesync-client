"use client";

import {
  RunSummary,
  SubmissionResponse,
  SubmissionStatistics,
  SubmissionType,
  SupportedLanguages,
} from "@/src/interfaces/submission.interface";
import * as Monaco from "monaco-editor";
import Editor from "@/src/components/ui/fields/Editor";
import React from "react";
import { Bar } from "react-chartjs-2";
import { FaRegClock } from "react-icons/fa";
import { FaMemory, FaXmark } from "react-icons/fa6";

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
  const readonlyEditor =
    React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const passedCountLabel = (
    <div className="w-full flex items-center justify-end">
      <p
        className={`p-2 rounded-md text-xs font-semibold ${props.runOutput.summary?.passed === props.runOutput.summary?.total ? "bg-green-300" : "bg-red-300"}`}
      >
        {props.runOutput.summary?.passed} / {props.runOutput.summary?.total}{" "}
        Test Cases Passed
      </p>
    </div>
  );

  const failedTestCase = props.runOutput.summary?.failed.testCase ? (
    <div className="w-full flex flex-col items-start justify-start gap-2">
      <p className="text-xs mt-2">Input</p>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        {Object.entries(props.runOutput.summary.failed.testCase.input).map(
          ([param, value]) => {
            const parsedValue = JSON.stringify(value, null, 2);

            return (
              <div
                key={param}
                className="p-4 rounded-md bg-neutral-300 text-sm w-full"
              >
                <p className="font-medium text-xs opacity-80">{param}=</p>
                <p className="font-medium mt-1">{parsedValue}</p>
              </div>
            );
          },
        )}
      </div>

      <p className="text-xs mt-2">Expected Output</p>
      <div className="p-4 rounded-md bg-neutral-300 text-sm w-full">
        <p className="font-medium ">
          {JSON.stringify(
            props.runOutput.summary.failed.testCase.expected_output,
            null,
            2,
          )}
        </p>
      </div>

      <p className="text-xs mt-2">Submission Output</p>
      <div className="p-4 rounded-md bg-red-300 text-red-900 text-sm w-full">
        <p className="font-medium">
          {JSON.stringify(props.runOutput.summary.failed.output, null, 2)}
        </p>
      </div>
    </div>
  ) : null;

  const resourceUsage = !props.runOutput.summary?.failed.testCase ? (
    <div className="w-full grid grid-cols-1 gap-2 t:grid-cols-2">
      <button
        onClick={() => props.handleActiveChart("runtime")}
        className={`w-full p-4 rounded-md flex flex-row justify-between items-center text-left transition-all bg-cyan-500
                                       ${props.activeChart === "runtime" ? "opacity-100" : "opacity-50"}`}
      >
        <p className="flex flex-col">
          <span className="text-xs text-secondary font-light">
            Average Run Time
          </span>
          <span className="text-2xl text-primary-300 font-black mt-auto">
            {props.runOutput.summary?.runtime} ms
          </span>
        </p>
        <p>
          <FaRegClock className="text-secondary text-2xl" />
        </p>
      </button>

      <button
        onClick={() => props.handleActiveChart("memory")}
        className={`w-full p-4 rounded-md flex flex-row justify-between items-center text-left transition-all bg-emerald-500
                                       ${props.activeChart === "memory" ? "opacity-100" : "opacity-50"}`}
      >
        <p className="flex flex-col">
          <span className="text-xs text-secondary font-light">
            Average Memory Used
          </span>
          <span className="text-2xl text-primary-300 font-black mt-auto">
            {props.runOutput.summary?.memory} MB
          </span>
        </p>
        <p>
          <FaMemory className="text-secondary text-2xl" />
        </p>
      </button>
    </div>
  ) : null;

  const resourceGraph = !props.runOutput.summary?.failed.testCase ? (
    <div className="w-full aspect-video p-2 rounded-md bg-primary">
      <Bar
        data={{
          labels:
            props.activeChart === "runtime"
              ? props.runOutput.statistics?.runtime
                  .sort((a, b) => a.ms - b.ms)
                  .map((stat) => stat.ms)
              : props.runOutput.statistics?.memory
                  .sort((a, b) => a.mb - b.mb)
                  .map((stat) => stat.mb),
          datasets: [
            {
              label: "Memory",
              data:
                props.activeChart === "runtime"
                  ? props.runOutput.statistics?.runtime
                      .sort((a, b) => a.percentage - b.percentage)
                      .map((stat) => stat.percentage)
                  : props.runOutput.statistics?.memory
                      .sort((a, b) => a.percentage - b.percentage)
                      .map((stat) => stat.percentage),
              backgroundColor: [
                props.activeChart === "runtime"
                  ? "oklch(78.9% 0.154 211.53)"
                  : "oklch(76.5% 0.177 163.223)",
              ],
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              beginAtZero: true,
            },
          },
          responsive: true,
          maintainAspectRatio: true,
          resizeDelay: 1,
        }}
      />
    </div>
  ) : null;

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
          {passedCountLabel}

          {props.runOutput.summary?.failed.testCase ? (
            failedTestCase
          ) : (
            <div className="w-full flex flex-col items-start justify-start gap-2">
              {resourceUsage}

              {resourceGraph}

              <div className="w-full p-2 rounded-md bg-[#1e1e1e] text-secondary max-h-80 resize-y h-full min-h-72">
                <Editor
                  ref={readonlyEditor}
                  boilerPlate={props.runOutput.summary?.code ?? ""}
                  language={props.runOutput.summary?.language ?? props.language}
                  readOnly={true}
                />
              </div>
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
