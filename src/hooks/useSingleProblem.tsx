"use client";

import { SupportedLanguages } from "@/src/interfaces/language.interface";
import {
  BaseProblem,
  DetailsPanel,
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
import { BaseTopic } from "@/interfaces/topic.interface";
import { BaseHint } from "../interfaces/hint.interface";
import { useSession } from "next-auth/react";

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
    constraints: {},
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
  const [submissionState, submissionDispatch] = React.useReducer(
    submissionReducer,
    null,
  );
  const [activeDetailsPanel, setActiveDetailsPanel] =
    React.useState<DetailsPanel>("description");
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);
  const [hints, setHints] = React.useState<BaseHint[]>([]);
  const [loading, setLoading] = React.useState(true);

  const params: { slug?: string } | null = useParams();
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getProblem = React.useCallback(async () => {
    setLoading(true);

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
      setTopics(data.topics);
      setHints(data.hints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const handleSubmission = React.useCallback(
    async (type: SubmissionType) => {
      try {
        if (!params?.slug) return;

        if (!editorRef.current) return;

        if (!user?.id) return;

        const code = editorRef.current.getValue();

        localStorage.setItem(
          `${params.slug}_${user.id}_${currentLanguage}`,
          code,
        );

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
          setActiveDetailsPanel("result");

          submissionDispatch({
            type: `submit_run_success`,
            output: {
              judge: { ...data.judge },
              summary: data.summary,
              statistics: data.statistics,
            },
          });
        } else {
          submissionDispatch({
            type: `submit_test_success`,
            output: { judge: { ...data.judge } },
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
    [currentLanguage, user, params],
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

  const handleActiveDetailsPanel = (panel: DetailsPanel) => {
    setActiveDetailsPanel(panel);
  };

  const handleSubmissionState = (action: SubmissionAction) => {
    submissionDispatch(action);
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
          typeof submissionState.test === "object"
            ? { judge: submissionState.test.judge }
            : { judge: {} },
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
          typeof submissionState.run === "object"
            ? { judge: submissionState.run.judge }
            : { judge: {} },
      }
    : null;

  const startingCodeKey = `${params?.slug ?? ""}_${user?.id}_${currentLanguage}`;

  // use this hook to get localstorage without tripping lint and undefined localstorage
  const storedCode = React.useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === undefined || !params?.slug) {
        return "";
      }

      return localStorage.getItem(startingCodeKey);
    },
    () => "",
  );

  const startingCode =
    storedCode ||
    generateBoilerPlate(
      problem.input_format,
      problem.output_format,
      currentLanguage,
    );

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
    topics,
    hints,
    loading,
    getProblem,
    handleSubmission,
    handleCanDelete,
    handleCurrentLanguage,
    handleClearSubmissionState,
    handleActiveChart,
    handleActiveDetailsPanel,
    handleSubmissionState,
  };
}
