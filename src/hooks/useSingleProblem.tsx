"use client";

import { BaseHint } from "@/interfaces/hint.interface";
import { SupportedLanguages } from "@/interfaces/language.interface";
import {
  BaseProblem,
  DetailsPanel,
  GetProblemResponse,
  GetSubmissionResponse,
} from "@/interfaces/problem.interface";
import {
  CreateSubmissionResponse,
  RunSubmissionResult,
  SubmissionAction,
  SubmissionState,
  SubmissionType,
  TestSubmissionResult,
} from "@/interfaces/submission.interface";
import { BaseTestCase } from "@/interfaces/test-case.interface";
import { BaseTopic } from "@/interfaces/topic.interface";
import { getErrorMessage } from "@/utils/general.util";
import { generateBoilerPlate } from "@/utils/problem.util";
import { errorToast } from "@/utils/toast.util";
import * as Monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

// A "test"/"run" result is stored as either a judge object or an error string.
// One reducer keeps both outputs in a single source of truth.
const submissionReducer = (
  state: SubmissionState,
  action: SubmissionAction,
): SubmissionState => {
  switch (action.type) {
    case "submit_test_success":
    case "submit_test_error":
      return { ...state, test: action.output };
    case "submit_run_success":
    case "submit_run_error":
      return { ...state, run: action.output };
    case "clear_run": {
      const nextState = { ...state };
      delete nextState.run;
      return nextState;
    }
    case "clear_test": {
      const nextState = { ...state };
      delete nextState.test;
      return nextState;
    }
    default:
      return state;
  }
};

// Collapses a raw reducer entry (result object | error string) into the shape
// the UI renders (success flag + message + normalized output).
const normalizeTestOutput = (
  test: NonNullable<SubmissionState>["test"],
): TestSubmissionResult => {
  if (!test) return null;

  const hasError = typeof test === "string";

  return {
    success: !hasError,
    error: hasError ? test : "",
    output: hasError ? { judge: {} } : { judge: test.judge },
  };
};

const normalizeRunOutput = (
  run: NonNullable<SubmissionState>["run"],
): RunSubmissionResult => {
  if (!run) return null;

  const hasError = typeof run === "string";

  return {
    success: !hasError,
    error: hasError ? run : "",
    output: hasError ? { judge: {} } : { judge: run.judge },
    summary: hasError ? null : run.summary,
    statistics: hasError ? null : run.statistics,
  };
};

export default function useSingleProblem() {
  // Problem data fetched from the API.
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
  const [testCases, setTestCases] = React.useState<BaseTestCase[]>([]);
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);
  const [hints, setHints] = React.useState<BaseHint[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Code editor + current language.
  const [currentLanguage, setCurrentLanguage] =
    React.useState<SupportedLanguages>("javascript");
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );

  // Test/run submission outputs (normalized below before reaching the UI).
  const [submissionState, submissionDispatch] = React.useReducer(
    submissionReducer,
    null,
  );

  // UI state.
  const [activeChart, setActiveChart] = React.useState<"runtime" | "memory">(
    "runtime",
  );
  const [activeDetailsPanel, setActiveDetailsPanel] =
    React.useState<DetailsPanel>("description");
  const [canDelete, setCanDelete] = React.useState(false);
  const [usedHints, setUsedHints] = React.useState<number[]>([]);

  const [openedSubmission, setOpenedSubmission] = React.useState(0);
  const [submitting, setSubmitting] = React.useState<SubmissionType | null>(
    null,
  );

  const params: { slug?: string } | null = useParams();
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  // Fetches the problem, its test cases, topics and hints.
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
      errorToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Submits the current editor code as either a "test" or a full "run".
  const handleSubmission = React.useCallback(
    async (type: SubmissionType) => {
      if (!params?.slug || !editorRef.current || !user?.id) return;

      setSubmitting(type);

      const code = editorRef.current.getValue();

      // Persist the code so it survives a refresh.
      localStorage.setItem(
        `${params.slug}_${user.id}_${currentLanguage}`,
        code,
      );

      try {
        const response = await fetch(`/api/submission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submission: {
              type,
              code,
              language: currentLanguage,
              problem: params.slug,
              hints_used: usedHints.length,
            },
          }),
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
            type: "submit_run_success",
            output: {
              judge: { ...data.judge },
              summary: data.summary,
              statistics: data.statistics,
            },
          });
        } else {
          submissionDispatch({
            type: "submit_test_success",
            output: { judge: { ...data.judge } },
          });
        }
      } catch (err) {
        submissionDispatch({
          type: `submit_${type}_error`,
          output: getErrorMessage(err),
        });
      } finally {
        setSubmitting(null);
      }
    },
    [currentLanguage, user, params, usedHints],
  );

  // Loads a past submission's judge output into the result panel.
  const getSubmission = async (id: number) => {
    try {
      const response = await fetch(`/api/submission/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetSubmissionResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      submissionDispatch({
        type: "submit_run_success",
        output: {
          judge: { ...data.judge },
          statistics: data.statistics,
          summary: data.summary,
        },
      });
    } catch (error) {
      submissionDispatch({
        type: "submit_run_error",
        output: getErrorMessage(error),
      });
    } finally {
      setActiveDetailsPanel("result");
    }
  };

  const handleOpenedSubmission = (id: number) => {
    setOpenedSubmission((prev) => (prev === id ? 0 : id));
  };

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  const handleCurrentLanguage = (language: SupportedLanguages) => {
    setCurrentLanguage(language);
  };

  const handleActiveChart = (chart: "runtime" | "memory") => {
    setActiveChart(chart);
  };

  const handleActiveDetailsPanel = (panel: DetailsPanel) => {
    setActiveDetailsPanel(panel);
  };

  const handleUsedHints = (hintId: number) => {
    setUsedHints((prev) => (prev.includes(hintId) ? prev : [...prev, hintId]));
  };

  // Clears a stored submission output; clearing "run" also leaves the result tab.
  const handleClearSubmissionState = (type: SubmissionType) => {
    submissionDispatch({ type: `clear_${type}` });

    if (type === "run") {
      setActiveDetailsPanel("description");
    }
  };

  // Key used to persist the current code (per problem + user + language).
  const startingCodeKey = `${params?.slug ?? ""}_${user?.id}_${currentLanguage}`;

  // Reads the last saved code for this problem/language. useSyncExternalStore
  // lets us snapshot localStorage during render without hydration mismatches
  // (and re-reads whenever the language changes).
  const storedCode = React.useSyncExternalStore(
    () => () => {},
    () =>
      typeof window === "undefined" || !params?.slug
        ? ""
        : (localStorage.getItem(startingCodeKey) ?? ""),
    () => "",
  );

  // The editor starts from the saved code, falling back to the boilerplate.
  const startingCode =
    storedCode ||
    generateBoilerPlate(
      problem.input_format,
      problem.output_format,
      currentLanguage,
    );

  // Normalized judge outputs for the test-case and result panels.
  const submittedTestOutput = normalizeTestOutput(submissionState?.test);
  const submittedRunOutput = normalizeRunOutput(submissionState?.run);

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
    openedSubmission,
    submitting,
    getSubmission,
    getProblem,
    handleSubmission,
    handleCanDelete,
    handleCurrentLanguage,
    handleClearSubmissionState,
    handleActiveChart,
    handleActiveDetailsPanel,
    handleUsedHints,
    handleOpenedSubmission,
  };
}
