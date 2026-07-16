"use client";

import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetTestCaseCountResponse,
  ProblemTestCaseCount,
} from "@/src/interfaces/test-case.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import React from "react";
import ProblemTestCases from "./ProblemTestCases";

const AllTestCases = (props: { problem?: string }) => {
  const [testCases, setTestCases] = React.useState<ProblemTestCaseCount>({});
  const [selectedProblem, setSelectedProblem] = React.useState<string | null>(
    props.problem ?? null,
  );

  const {
    pages,
    page,
    limit,
    canSelectLimit,
    handleCanSelectLimit,
    handleLimit,
    handlePage,
    handlePages,
  } = usePaginate();

  const handleSelectedProblem = (problem: string) => {
    setSelectedProblem((prev) => (prev === problem ? null : problem));
  };

  const problemParam = props?.problem;

  const mappedProblems = Object.entries(testCases ?? {}).map(
    ([problem, count]) => {
      return (
        <button
          key={problem}
          onClick={() => handleSelectedProblem(problem)}
          className="w-full text-left bg-neutral-200 rounded-lg p-4 flex flex-col items-start justify-start gap-2 cursor-pointer hover:bg-neutral-300 transition-all"
        >
          <p className="text-sm font-bold capitalize truncate w-full">
            {normalizeString(problem)}
          </p>

          <p className="text-xs text-neutral-500">
            {count} {count === 1 ? "test case" : "test cases"}
          </p>
        </button>
      );
    },
  );

  React.useEffect(() => {
    const getTestCases = async () => {
      try {
        const searchParams = {
          problem: problemParam ?? "",
          limit: String(limit),
          page: String(page),
          list_all: "0",
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/test-case?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetTestCaseCountResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { test_cases, pagination } = resolve.data;

        setTestCases(test_cases);
        handlePages(pagination.pages);
      } catch (error) {
        console.log(error);
      }
    };

    getTestCases();
  }, [problemParam, limit, page, handlePages]);

  return (
    <div className="flex flex-col items-center justify-start gap-8 w-full">
      <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
        {mappedProblems}
      </div>
      {selectedProblem && (
        <ProblemTestCases
          selectedProblem={selectedProblem}
          handleSelectedProblem={handleSelectedProblem}
        />
      )}

      <Paginate
        limit={limit}
        pages={pages}
        page={page}
        canSelectLimit={canSelectLimit}
        handleCanSelectLimit={handleCanSelectLimit}
        handleLimit={handleLimit}
        handlePage={handlePage}
      />
    </div>
  );
};

export default AllTestCases;
