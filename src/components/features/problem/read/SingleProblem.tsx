"use client";

import Editor from "@/src/components/ui/fields/Editor";
import {
  BaseProblem,
  GetProblemResponse,
} from "@/src/interfaces/problem.interface";
import { useParams } from "next/navigation";
import React from "react";

const SingleProblem = () => {
  const [problem, setProblem] = React.useState<BaseProblem>({
    id: 0,
    title: "",
    slug: "",
    description: "",
    input_format: "",
    output_format: "",
    constraints: "",
    editorial: "",
    difficulty: "easy",
    acceptance_rate: 0,
    total_submissions: 0,
  });
  const params = useParams();

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
    } catch (err) {
      console.error(err);
    }
  }, [params]);

  React.useEffect(() => {
    getProblem();
  }, [getProblem]);

  return (
    <div className="w-full grid grid-cols-1 items-start justify-start gap-4 l-s:grid-cols-2 l-s:h-full">
      <div className="w-full flex flex-col items-start justify-start gap-8 l-s:h-full l-s:overflow-y-auto p-2 border rounded-md border-neutral-400">
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <h1 className="text-xl font-bold text-pretty t:text-2xl">
            {problem.id}. {problem.title}
          </h1>

          <p className="text-sm whitespace-pre-wrap">{problem.description}</p>
        </div>

        <div className="text-sm">
          <p>Constraints: </p>
          <p className="whitespace-pre">formatted constraint here</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 grid-rows-1 items-start justify-start gap-4 l-s:h-full l-s:overflow-y-hidden">
        <div className="w-full grid grid-cols-1 grid-rows-3 items-start justify-start gap-4 h-screen l-s:h-full">
          <div className="w-full h-full p-2 rounded-md bg-primary row-span-2">
            <Editor />
          </div>

          <div className="w-full p-2 rounded-md h-full row-span-1 overflow-y-auto gap-2 border border-neutral-400 flex flex-col">
            <div className="w-full rounded-sm bg-neutral-200 p-8"></div>
            <div className="w-full rounded-sm bg-neutral-200 p-8"></div>
            <div className="w-full rounded-sm bg-neutral-200 p-8"></div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-2 t:flex-row t:justify-between">
          <button
            type="button"
            className="w-full p-2 rounded-md font-bold bg-neutral-200 t:max-w-30 t:px-4"
          >
            Test
          </button>
          <button
            type="button"
            className="w-full p-2 rounded-md font-bold bg-primary text-secondary t:max-w-30 t:px-4"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
