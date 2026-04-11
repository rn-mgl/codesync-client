"use client";

import { SupportedLanguages } from "@/src/interfaces/language.interface";
import {
  BaseProblem,
  GetProblemResponse,
} from "@/src/interfaces/problem.interface";
import {
  CreateSubmissionResponse,
  RunSummary,
  SubmissionAction,
  SubmissionResponse,
  SubmissionState,
  SubmissionStatistics,
  SubmissionType,
} from "@/src/interfaces/submission.interface";
import { BaseTestCase } from "@/src/interfaces/test-case.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { generateBoilerPlate } from "@/src/utils/problem.util";
import * as Monaco from "monaco-editor";
import { useParams } from "next/navigation";
import React from "react";

const submissionReducer = (
  state: SubmissionState,
  action: SubmissionAction,
) => {
  switch (action.type) {
    case "submit_test_success":
      return {
        ...state,
        test: action.output,
      };
    case "submit_run_success":
      return {
        ...state,
        run: action.output,
      };
    case "submit_test_error":
      return {
        ...state,
        test: action.output,
      };
    case "submit_run_error":
      return {
        ...state,
        run: action.output,
      };
    case "clear_run":
      const removedRun = { ...state };
      delete removedRun.run;
      return removedRun;
    case "clear_test":
      const removedTest = { ...state };
      delete removedTest.test;
      return removedTest;
    default:
      return state;
  }
};

export default function useSingleProblem() {
  const [problem, setProblem] = React.useState<BaseProblem>({
    id: 0,
    title: "",
    slug: "",
    description: "",
    input_format: {
      name: "",
      params: [],
      style: "function",
      version: 1,
    },
    output_format: {
      type: "",
      version: 1,
      comparison: {},
    },
    constraints: "",
    editorial: "",
    difficulty: "easy",
    acceptance_rate: 0,
    total_submissions: 0,
  });
  const [currentLanguage, setCurrentLanguage] =
    React.useState<SupportedLanguages>("javascript");
  const [testCases, setTestCases] = React.useState<BaseTestCase[]>([]);
  const [canDelete, setCanDelete] = React.useState(false);
  const [activeChart, setActiveChart] = React.useState<"runtime" | "memory">(
    "runtime",
  );
  const [startingCode, setStartingCode] = React.useState("");
  const [submissionState, submissionDispatch] = React.useReducer(
    submissionReducer,
    null,
  );
  const [activeDetailsPanel, setActiveDetailsPanel] = React.useState<
    "description" | "editorial" | "submission"
  >("description");

  const params: { slug?: string } | null = useParams();
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );

  const getProblem = React.useCallback(async () => {
    try {
      if (!params?.slug) return;

      const response = await fetch(`/api/problem/${params.slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetProblemResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      setProblem(data.problem);
      setTestCases(data.testCases);
    } catch (err) {
      console.error(err);
    }
  }, [params]);

  const handleSubmission = React.useCallback(
    async (type: SubmissionType) => {
      try {
        if (!params?.slug) return;

        if (!editorRef.current) return;

        const code = editorRef.current.getValue();

        localStorage.setItem(`${params.slug}_${currentLanguage}`, code);

        const submission = {
          type,
          code: code,
          language: currentLanguage,
          problem: params.slug,
        };

        const response = await fetch(`/api/submission/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ submission }),
        });

        const resolve: CreateSubmissionResponse<typeof type> =
          await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const data = resolve.data;

        if (!data.judge) {
          throw new Error(`An error occurred during validation.`);
        }

        if (type === "run" && "summary" in data) {
          setActiveDetailsPanel("submission");

          submissionDispatch({
            type: `submit_run_success`,
            output: {
              ...data.judge,
              summary: data.summary,
              statistics: data.statistics,
            },
          });
        } else {
          submissionDispatch({
            type: `submit_test_success`,
            output: data.judge,
          });
        }
      } catch (err) {
        submissionDispatch({
          type: `submit_${type}_error`,
          output: getErrorMessage(err),
        });
        console.error(err);
      }
    },
    [currentLanguage, params],
  );

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  const handleCurrentLanguage = (language: SupportedLanguages) => {
    setCurrentLanguage(language);
  };

  const handleClearSubmissionState = (type: SubmissionType) => {
    submissionDispatch({
      type: `clear_${type}`,
    });

    if (type === "run") {
      setActiveDetailsPanel("description");
    }
  };

  const handleActiveChart = (chart: "runtime" | "memory") => {
    setActiveChart(chart);
  };

  const handleActiveDetailsPanel = (
    panel: "description" | "editorial" | "submission",
  ) => {
    setActiveDetailsPanel(panel);
  };

  // check type to handle errors
  const didSubmitTest = submissionState && !!submissionState.test;

  const didSubmitRun = submissionState && !!submissionState.run;

  const submittedTestOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
  } | null = didSubmitTest
    ? {
        success: typeof submissionState.test === "object",
        error:
          typeof submissionState.test === "string" ? submissionState.test : "",
        output:
          typeof submissionState.test === "object" ? submissionState.test : {},
      }
    : null;

  const submittedRunOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
    summary: RunSummary | null;
    statistics: SubmissionStatistics | null;
  } | null = didSubmitRun
    ? {
        success: typeof submissionState.run === "object",
        error:
          typeof submissionState.run === "string" ? submissionState.run : "",
        statistics:
          typeof submissionState.run === "object"
            ? submissionState.run.statistics
            : null,
        summary:
          typeof submissionState.run === "object"
            ? submissionState.run.summary
            : null,
        output:
          typeof submissionState.run === "object" ? submissionState.run : {},
      }
    : null;

  React.useEffect(() => {
    const storedCode = localStorage.getItem(
      `${params?.slug}_${currentLanguage}`,
    );

    setStartingCode(
      storedCode || generateBoilerPlate(problem.input_format, currentLanguage),
    );
  }, [params?.slug, problem.input_format, currentLanguage]);

  return {
    problem,
    currentLanguage,
    testCases,
    canDelete,
    activeChart,
    startingCode,
    editorRef,
    submittedTestOutput,
    submittedRunOutput,
    activeDetailsPanel,
    getProblem,
    handleSubmission,
    handleCanDelete,
    handleCurrentLanguage,
    handleClearSubmissionState,
    handleActiveChart,
    handleActiveDetailsPanel,
  };
}
