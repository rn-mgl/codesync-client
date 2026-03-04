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
    <div className="w-full grid grid-cols-1 items-start justify-start gap-4 l-s:grid-cols-2 l-s:h-full ">
      <div className="w-full flex flex-col items-start justify-start gap-8 l-s:h-full l-s:overflow-y-auto p-2">
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <h1 className="text-xl font-bold text-pretty t:text-2xl">
            {problem.id}. {problem.title}
          </h1>

          <p className="text-sm">{problem.description}</p>
        </div>

        <p className="text-sm">{problem.constraints} constraints here</p>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-4 h-full l-s:overflow-y-hidden">
        <Editor />

        <div className="w-full p-2 text-secondary rounded-md min-h-90 l-s:h-full l-s:min-h-auto overflow-y-hidden bg-neutral-600">
          Tests here
        </div>
      </div>
    </div>
  );
};

export default SingleProblem;
