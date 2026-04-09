"use client";

import Editor from "@/src/components/ui/fields/Editor";
import Delete from "@/src/components/ui/forms/Delete";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaCheck, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";
import EditorActions from "./EditorActions";
import ProblemActions from "./ProblemActions";
import ProblemDetails from "./ProblemDetails";
import ProblemTestCases from "./ProblemTestCases";
import RunResults from "./RunResults";

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
  }
};

const SingleProblem = () => {
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

  useSession({ required: true });

  const params: { slug?: string } | null = useParams();
  const router = useRouter();
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

  const handleSubmission = async (type: SubmissionType) => {
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
  };

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
  };

  const handleActiveChart = (chart: "runtime" | "memory") => {
    setActiveChart(chart);
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

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s" && params?.slug) {
        e.preventDefault();

        localStorage.setItem(
          `${params?.slug}_${currentLanguage}`,
          editorRef.current?.getValue() ?? "",
        );

        toast(
          <span className="flex gap-1 items-center justify-center">
            Code Saved <FaCheck />
          </span>,
        );
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [params?.slug, currentLanguage]);

  React.useEffect(() => {
    getProblem();
  }, [getProblem]);

  return (
    <div className="w-full grid grid-cols-1 gap-4 l-s:grid-cols-2 l-s:h-full">
      {canDelete && (
        <Delete
          label="Problem"
          endpoint={`/problem/${params?.slug}`}
          postDeleteAction={() => {
            router.push("/codesync/problems");
          }}
          closeForm={handleCanDelete}
        />
      )}

      <div className="w-full h-full flex flex-col l-s:overflow-hidden gap-4">
        <Link
          href="/codesync/problems"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Problems
        </Link>

        <div className="w-full h-full max-h-screen flex flex-col l-s:overflow-hidden border rounded-md border-neutral-400 bg-secondary">
          <div className="w-full h-full flex flex-col gap-8 p-2 overflow-y-auto l-s:max-h-full">
            {submittedRunOutput ? (
              <RunResults
                runOutput={submittedRunOutput}
                language={currentLanguage}
                activeChart={activeChart}
                handleClearSubmissionState={handleClearSubmissionState}
                handleActiveChart={handleActiveChart}
              />
            ) : (
              <ProblemDetails problem={problem} />
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-2 l-s:h-full l-s:overflow-y-hidden">
        <ProblemActions
          language={currentLanguage}
          handleCurrentLanguage={handleCurrentLanguage}
          handleCanDelete={handleCanDelete}
        />

        <div className="w-full grid grid-cols-1 grid-rows-2 items-start justify-start gap-4 h-screen l-s:h-full rounded-md overflow-hidden">
          <div className="w-full h-full grid-rows-1 p-2 rounded-md bg-[#1e1e1e] flex flex-col items-center justify-center">
            <Editor
              language={currentLanguage}
              boilerPlate={startingCode}
              ref={editorRef}
            />
            <EditorActions handleSubmission={handleSubmission} />
          </div>

          <div className="w-full flex flex-col items-end justify-start grid-rows-1 h-full overflow-y-hidden">
            {didSubmitTest && (
              <button
                title="Clear Test Result"
                onClick={() => handleClearSubmissionState("test")}
                className="p-2 rounded-full hover:text-red-800 bg-secondary animate-fade"
              >
                <FaXmark />
              </button>
            )}

            <div className="w-full h-full rounded-md flex flex-col items-start justify-start overflow-y-hidden">
              <ProblemTestCases
                testCases={testCases}
                submittedTestOutput={submittedTestOutput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
