"use client";

import {
  GetAllHintsResponse,
  ProblemHintList,
} from "@/src/interfaces/hint.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import React from "react";
import ProblemHints from "./ProblemHints";

const AllHints = (props: { problem?: string }) => {
  const [hints, setHints] = React.useState<ProblemHintList>({});
  const [selectedProblem, setSelectedProblem] = React.useState<string | null>(
    null,
  );

  const problemParam = props.problem;

  const handledSelectedProblem = (problem: string) => {
    setSelectedProblem((prev) => (prev === problem ? null : problem));
  };

  const mappedProblems = Object.entries(hints).map(([problem, list]) => {
    return (
      <div
        key={problem}
        onClick={() => setSelectedProblem(problem)}
        className="w-full bg-neutral-200 rounded-lg p-4 flex flex-col items-start justify-start gap-2 cursor-pointer hover:bg-neutral-300 transition-colors"
      >
        <p className="text-sm font-bold capitalize truncate w-full">
          {normalizeString(problem)}
        </p>
        <p className="text-xs text-neutral-500">
          {list.length} {list.length === 1 ? "hint" : "hints"}
        </p>
      </div>
    );
  });

  React.useEffect(() => {
    const getHints = async () => {
      try {
        const searchParams = {
          problem: problemParam ?? "",
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/hint?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllHintsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { hints } = resolve.data;

        setHints(hints);
      } catch (error) {
        console.log(error);
      }
    };

    getHints();
  }, [problemParam]);

  return (
    <>
      <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
        {mappedProblems}
      </div>

      {selectedProblem && (
        <ProblemHints
          problemHints={hints[selectedProblem]}
          selectedProblem={selectedProblem}
          handleSelectedProblem={handledSelectedProblem}
        />
      )}
    </>
  );
};

export default AllHints;
