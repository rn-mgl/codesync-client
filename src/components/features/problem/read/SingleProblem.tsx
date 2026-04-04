"use client";

import TabbedSection from "@/src/components/ui/containers/TabbedSection";
import Editor from "@/src/components/ui/fields/Editor";
import Delete from "@/src/components/ui/forms/Delete";
import { SupportedLanguages } from "@/src/interfaces/language.interface";
import {
  BaseProblem,
  GetProblemResponse,
} from "@/src/interfaces/problem.interface";
import {
  CreateSubmissionResponse,
  SubmissionAction,
  SubmissionResponse,
  SubmissionState,
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
import { FaRegEdit } from "react-icons/fa";
import {
  FaArrowLeft,
  FaCode,
  FaRegFileCode,
  FaRegTrashCan,
} from "react-icons/fa6";
import Languages from "./Languages";

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
  const [canSelectLanguage, setCanSelectLanguage] = React.useState(false);
  const [testCases, setTestCases] = React.useState<BaseTestCase[]>([]);
  const [canDelete, setCanDelete] = React.useState(false);

  const [submissionState, submissionDispatch] = React.useReducer(
    submissionReducer,
    null,
  );

  useSession({ required: true });

  const params = useParams();
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

      const submission = {
        type,
        code: editorRef.current.getValue(),
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

      const resolve: CreateSubmissionResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data.judge) {
        throw new Error(`An error occurred during validation.`);
      }

      submissionDispatch({
        type: `submit_${type}_success`,
        output: data.judge,
      });
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

  const handleCanSelectLanguage = () => {
    setCanSelectLanguage((prev) => !prev);
  };

  // check type to handle errors
  const didSubmitTest = submissionState && !!submissionState.test;

  const didSubmitRun = submissionState && !!submissionState.run;

  let submittedTestOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
  } | null = null;

  let submittedRunOutput: {
    success: boolean;
    error: string;
    output: SubmissionResponse;
  } | null = null;

  let totalCheckedTestCases: number = 0;

  let passedTestCasesCount: number = 0;

  let failedTestCaseId: number | null = null;

  let failedTestCaseDetails: BaseTestCase | undefined | null = null;

  let passedTestCasesLabel: string | null = null;

  if (didSubmitTest) {
    // it's an error if the test value is string
    submittedTestOutput = {
      success: typeof submissionState.test === "object",
      error:
        typeof submissionState.test === "string" ? submissionState.test : "",
      output:
        typeof submissionState.test === "object" ? submissionState.test : {},
    };
  }

  if (didSubmitRun) {
    // it's an error if the run value is string
    submittedRunOutput = {
      success: typeof submissionState.run === "object",
      error: typeof submissionState.run === "string" ? submissionState.run : "",
      output:
        typeof submissionState.run === "object" ? submissionState.run : {},
    };

    if (submittedRunOutput.success) {
      const runOutput = submittedRunOutput.output;

      totalCheckedTestCases = Object.values(runOutput).length;

      failedTestCaseId =
        Number(
          Object.entries(runOutput).find((output) => !output[1]?.matched)?.[0],
        ) ?? null;

      failedTestCaseDetails = failedTestCaseId
        ? testCases.find((tc) => tc.id === failedTestCaseId)
        : null;

      passedTestCasesCount = Object.values(runOutput).reduce(
        (count, output) => {
          return output?.matched ? count + 1 : count;
        },
        0,
      );
    }

    passedTestCasesLabel = `${passedTestCasesCount} / ${totalCheckedTestCases} Test Cases Passed`;
  }

  const mappedTestCases = testCases.map((tc) => {
    const mappedInput = Object.entries(tc.input).map(([param, value]) => {
      const parsedValue: string = JSON.stringify(value, null, 2);

      return (
        <div
          key={param}
          className="p-4 rounded-md bg-neutral-300 text-sm w-full"
        >
          <p className="font-medium text-xs opacity-80">{param}= </p>
          <p className="font-medium mt-1">{parsedValue}</p>
        </div>
      );
    });

    const matchingSubmissionOutput =
      submittedTestOutput &&
      submittedTestOutput.success &&
      JSON.stringify(submittedTestOutput.output[tc.id].result, null, 2);

    const isCorrectSubmissionOutput =
      submittedTestOutput &&
      submittedTestOutput.success &&
      submittedTestOutput.output[tc.id].matched;

    const matchingSubmissionError =
      submittedTestOutput &&
      !submittedTestOutput.success &&
      submittedTestOutput.error;

    return (
      <div
        key={tc.id}
        className="w-full h-auto flex flex-col items-start justify-start gap-2 p-2 rounded-md bg-neutral-200 overflow-y-auto"
      >
        <p className="text-xs">Input</p>
        <div className="w-full flex flex-col items-center justify-start gap-2">
          {mappedInput}
        </div>

        <p className="text-xs mt-2">Expected Output</p>
        <div className="p-4 rounded-md bg-neutral-300 w-full text-sm">
          <p className="font-medium">
            {JSON.stringify(tc.expected_output, null, 2)}
          </p>
        </div>

        {matchingSubmissionOutput && (
          <>
            <p className="text-xs mt-2">Submission Output</p>
            <div
              className={`p-4 rounded-md w-full text-sm 
                        ${isCorrectSubmissionOutput ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"}`}
            >
              <p className="font-medium">{matchingSubmissionOutput}</p>
            </div>
          </>
        )}

        {matchingSubmissionError && (
          <>
            <p className="text-xs mt-2">Submission Output</p>
            <div className="p-4 rounded-md w-full text-sm bg-red-300 text-red-900">
              <p
                className={`font-medium ${matchingSubmissionError && "whitespace-pre-line"}`}
              >
                {matchingSubmissionError}
              </p>
            </div>
          </>
        )}
      </div>
    );
  });

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
              submittedRunOutput.success ? (
                <div className="p-2 rounded-md bg-neutral-red-300 flex flex-col items-start justify-start gap-2">
                  <div className="w-full flex items-center justify-end">
                    <p
                      className={`p-2 rounded-md text-xs font-semibold ${passedTestCasesCount === totalCheckedTestCases ? "bg-green-300" : "bg-red-300"}`}
                    >
                      {passedTestCasesLabel}
                    </p>
                  </div>

                  {failedTestCaseDetails ? (
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                      <p className="text-xs mt-2">Input</p>
                      <div className="w-full flex flex-col items-start justify-start gap-2">
                        {Object.entries(failedTestCaseDetails.input).map(
                          ([param, value]) => {
                            const parsedValue = JSON.stringify(value, null, 2);

                            return (
                              <div
                                key={param}
                                className="p-4 rounded-md bg-neutral-300 text-sm w-full"
                              >
                                <p className="font-medium text-xs opacity-80">
                                  {param}=
                                </p>
                                <p className="font-medium mt-1">
                                  {parsedValue}
                                </p>
                              </div>
                            );
                          },
                        )}
                      </div>

                      <p className="text-xs mt-2">Expected Output</p>
                      <div className="p-4 rounded-md bg-neutral-300 text-sm w-full">
                        <p className="font-medium ">
                          {JSON.stringify(
                            failedTestCaseDetails.expected_output,
                            null,
                            2,
                          )}
                        </p>
                      </div>

                      <p className="text-xs mt-2">Submission Output</p>
                      <div className="p-4 rounded-md bg-red-300 text-red-900 text-sm w-full">
                        <p className="font-medium">
                          {failedTestCaseId &&
                            JSON.stringify(
                              submittedRunOutput.output[failedTestCaseId]
                                .result,
                              null,
                              2,
                            )}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-2 rounded-md bg-red-300">
                  <p className="text-red-900 whitespace-pre-line text-sm">
                    {submittedRunOutput.error}
                  </p>
                </div>
              )
            ) : (
              <>
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-xl font-bold text-pretty t:text-2xl">
                    {problem.id}. {problem.title}
                  </h1>

                  <p className="text-sm whitespace-pre-line">
                    {problem.description}
                  </p>
                </div>
                <div className="text-sm">
                  <p>Constraints: </p>
                  <p className="whitespace-pre">formatted constraint here</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-2 l-s:h-full l-s:overflow-y-hidden">
        <div className="w-full flex flex-row items-center justify-between gap-2 h-fit relative">
          <div className="flex gap-2 relative">
            <Link
              href={`/codesync/test-cases?problem=${params?.slug}`}
              title="Test Case"
              className="p-2 rounded-full bg-inherit hover:text-green-800 flex flex-col items-center justify-center"
            >
              <FaRegFileCode />
            </Link>
            <button
              title="Language"
              onClick={handleCanSelectLanguage}
              className={`p-2 rounded-full bg-inherit justify-center flex flex-row items-center 
                          gap-1 transition-all ${canSelectLanguage ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
            >
              <FaCode />
              <span className="text-xs capitalize">{currentLanguage}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <Link
              title="Edit"
              href={`/codesync/problems/${params?.slug}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-blue-800 flex flex-col items-center justify-center"
            >
              <FaRegEdit />
            </Link>

            <button
              title="Delete"
              onClick={handleCanDelete}
              className="p-2 rounded-full bg-inherit hover:text-red-800 flex flex-col items-center justify-center"
            >
              <FaRegTrashCan />
            </button>
          </div>

          {canSelectLanguage && (
            <Languages
              currentLanguage={currentLanguage}
              closeModal={handleCanSelectLanguage}
              selectLanguage={handleCurrentLanguage}
            />
          )}
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 h-screen l-s:h-full rounded-md overflow-hidden">
          <div className="w-full h-1/2 p-2 rounded-md bg-[#1e1e1e] flex flex-col items-center justify-center">
            <Editor
              currentLanguage={currentLanguage}
              boilerPlate={generateBoilerPlate(
                problem.input_format,
                currentLanguage,
              )}
              ref={editorRef}
            />
            <div className="w-full flex flex-row items-center justify-center gap-2 t:justify-end mt-2">
              <button
                onClick={() => handleSubmission("test")}
                type="button"
                className="w-full p-1 rounded-md font-bold bg-neutral-200 t:max-w-16 t:px-4 text-sm"
              >
                Test
              </button>

              <button
                onClick={() => handleSubmission("run")}
                type="button"
                className="w-full p-1 rounded-md font-bold bg-green-600 text-secondary t:max-w-16 t:px-4 text-sm"
              >
                Run
              </button>
            </div>
          </div>

          <div className="w-full rounded-md h-1/2 flex flex-col items-start justify-start overflow-y-hidden">
            <TabbedSection
              label={didSubmitTest ? "Submitted Test" : "Test Case"}
              content={mappedTestCases}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
