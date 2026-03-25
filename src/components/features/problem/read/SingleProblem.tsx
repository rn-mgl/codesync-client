"use client";

import TabbedSection from "@/src/components/ui/containers/TabbedSection";
import Editor from "@/src/components/ui/fields/Editor";
import Delete from "@/src/components/ui/forms/Delete";
import { generateBoilerPlate } from "@/src/utils/problem.util";
import {
  BaseProblem,
  GetProblemResponse,
} from "@/src/interfaces/problem.interface";
import { BaseTestCase } from "@/src/interfaces/test-case.interface";
import * as Monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaArrowLeft, FaRegFileCode, FaRegTrashCan } from "react-icons/fa6";

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
    },
    constraints: "",
    editorial: "",
    difficulty: "easy",
    acceptance_rate: 0,
    total_submissions: 0,
  });
  const [testCases, setTestCases] = React.useState<BaseTestCase[]>([]);

  const [canDelete, setCanDelete] = React.useState(false);

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

  const handleSubmission = async (type: "run" | "test") => {
    try {
      if (!params?.slug) return;

      if (!editorRef.current) return;

      const submission = {
        type,
        code: editorRef.current.getValue(),
        language: "javascript",
        problem: params.slug,
      };

      const response = await fetch(`/api/submission/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submission }),
      });

      const resolve = await response.json();

      console.log(resolve);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  const mappedTestCases = testCases.map((tc) => {
    const mappedInput = Object.entries(tc.input).map(([param, value]) => {
      const parsedValue: string | number = JSON.stringify(value);

      return (
        <div
          key={param}
          className="p-4 rounded-md bg-neutral-300 text-sm w-full"
        >
          <span className="font-medium">{param}: </span>
          <span>{parsedValue}</span>
        </div>
      );
    });

    return (
      <div
        key={tc.id}
        className="w-full h-full flex flex-col items-start justify-start gap-2 p-2 rounded-md bg-neutral-200"
      >
        <p className="text-xs">Input</p>
        <div className="w-full flex flex-col items-center justify-start gap-2">
          {mappedInput}
        </div>

        <p className="text-xs">Expected Output</p>
        <div className="p-4 rounded-md bg-neutral-300 w-full text-sm">
          <p>{JSON.stringify(tc.expected_output)}</p>
        </div>
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
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-xl font-bold text-pretty t:text-2xl">
                {problem.id}. {problem.title}
              </h1>

              <p className="text-sm whitespace-pre-wrap">
                {problem.description}
              </p>
            </div>

            <div className="text-sm">
              <p>Constraints: </p>
              <p className="whitespace-pre">formatted constraint here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-2 l-s:h-full l-s:overflow-y-hidden">
        <div className="w-full flex flex-row items-center justify-between gap-2 h-fit">
          <div className="flex gap-2">
            <Link
              href={`/codesync/test-cases?problem=${params?.slug}`}
              title="Test Case"
              className="p-2 rounded-full bg-inherit hover:text-green-800 flex flex-col items-center justify-center"
            >
              <FaRegFileCode />
            </Link>
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
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 h-screen l-s:h-full rounded-md overflow-hidden">
          <div className="w-full h-1/2 p-2 rounded-md bg-[#1e1e1e] flex flex-col items-center justify-center">
            <Editor
              boilerPlate={generateBoilerPlate(problem.input_format)}
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

          <div className="w-full rounded-md h-1/2 flex flex-col overflow-y-auto">
            <TabbedSection label="Test Case" content={mappedTestCases} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
