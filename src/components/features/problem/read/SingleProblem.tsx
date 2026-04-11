"use client";

import Editor from "@/src/components/ui/fields/Editor";
import Delete from "@/src/components/ui/forms/Delete";
import useSingleProblem from "@/src/hooks/useSingleProblem";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { toast } from "sonner";
import DetailsAction from "./DetailsAction";
import EditorActions from "./EditorActions";
import ProblemActions from "./ProblemActions";
import ProblemDetails from "./ProblemDetails";
import ProblemTestCases from "./ProblemTestCases";
import RunResults from "./RunResults";

const SingleProblem = () => {
  useSession({ required: true });

  const params: { slug?: string } | null = useParams();
  const router = useRouter();

  const {
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
  } = useSingleProblem();

  React.useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
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
      } else if (e.ctrlKey && e.key === "'") {
        await handleSubmission("test");
      } else if (e.ctrlKey && e.key === "Enter") {
        await handleSubmission("run");
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [params?.slug, editorRef, currentLanguage, handleSubmission]);

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

        <div className="w-full h-full max-h-screen flex flex-col l-s:overflow-hidden gap-2">
          <DetailsAction
            activeDetailsPanel={activeDetailsPanel}
            didSubmitRun={!!submittedRunOutput}
            handleActiveDetailsPanel={handleActiveDetailsPanel}
            handleClearSubmissionState={handleClearSubmissionState}
          />

          <div className="w-full h-full flex flex-col l-s:overflow-hidden border rounded-md border-neutral-400 bg-secondary">
            <div className="w-full h-full flex flex-col gap-8 p-2 overflow-y-auto l-s:max-h-full">
              {submittedRunOutput && activeDetailsPanel === "submission" ? (
                <RunResults
                  runOutput={submittedRunOutput}
                  language={currentLanguage}
                  activeChart={activeChart}
                  handleActiveChart={handleActiveChart}
                />
              ) : activeDetailsPanel === "description" ? (
                <ProblemDetails problem={problem} />
              ) : null}
            </div>
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
            <div className="w-full h-full rounded-md flex flex-col items-start justify-start overflow-y-hidden">
              <ProblemTestCases
                testCases={testCases}
                submittedTestOutput={submittedTestOutput}
                handleClearSubmissionState={handleClearSubmissionState}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
