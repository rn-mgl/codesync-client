"use client";

import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetAllTestCasesResponse,
  ProblemTestCaseProperties,
} from "@/src/interfaces/test-case.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaMemory,
  FaXmark,
} from "react-icons/fa6";

const ProblemTestCases = (props: {
  selectedProblem: string;
  handleSelectedProblem: (problem: string) => void;
}) => {
  const [testCases, setTestCases] = React.useState<ProblemTestCaseProperties[]>(
    [],
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

  React.useEffect(() => {
    const getTestCases = async () => {
      try {
        const searchParams = {
          problem: props.selectedProblem,
          list_all: "1",
          page: String(page),
          limit: String(limit),
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/test-case?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllTestCasesResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { test_cases, pagination } = resolve.data;

        setTestCases(test_cases[props.selectedProblem]);
        handlePages(pagination.pages);
      } catch (error) {
        console.log(error);
      }
    };

    getTestCases();
  }, [props.selectedProblem, page, limit, handlePages]);

  const mappedTestCases = testCases.map((tc) => {
    return (
      <div
        key={tc.id}
        className="w-full flex flex-col items-center justify-center"
      >
        <div className="w-full flex flex-col items-start justify-center text-sm">
          <Link
            href={`/codesync/test-cases/${tc.id}`}
            className="w-full p-4 border-b border-b-neutral-300 bg-neutral-200 rounded-t-md group"
          >
            <p className="font-bold text-base group-hover:underline underline-offset-2">
              TC {tc.id}
            </p>
          </Link>

          <div className="w-full p-4 flex flex-col items-start justify-center gap-2 bg-neutral-300 rounded-b-md">
            <div className="flex items-center w-full truncate gap-2">
              <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                <span>Input</span>
                <FaArrowRight />
              </div>
              <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                {JSON.stringify(tc.input)}
              </span>
            </div>

            <div className="flex items-center w-full truncate gap-2">
              <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                <span>Expected Output</span>
                <FaArrowLeft />
              </div>
              <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                {tc.expected_output}
              </span>
            </div>

            <div className="flex items-center w-full truncate gap-2">
              <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                <span>Memory Limit (mb)</span>
                <FaMemory />
              </div>
              <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                {JSON.stringify(tc.memory_limit_mb)} mb
              </span>
            </div>

            <div className="flex items-center w-full truncate gap-2">
              <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                <span>Time Limit (ms)</span>
                <FaClock />
              </div>
              <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                {JSON.stringify(tc.time_limit_ms)} ms
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>{normalizeString(props.selectedProblem)}</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => props.handleSelectedProblem(props.selectedProblem)}
              className="p-2 rounded-full hover:bg-secondary/20"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-8 overflow-y-auto">
          <div className="w-full flex items-center justify-end">
            <Link
              href={`/codesync/test-cases/create?problem=${props.selectedProblem}`}
              className="text-primary font-normal flex flex-row items-center
                            justify-center gap-2 hover:bg-secondary/20 p-1 text-sm hover:border-b px-1"
            >
              <span>Add Test Case</span>
              <FaPlus />
            </Link>
          </div>

          {testCases.length === 0 ? (
            <p className="text-sm text-neutral-500">No Test Cases yet.</p>
          ) : (
            <div className="grid grid-cols-1 items-start justify-start gap-4 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 w-full">
              {mappedTestCases}
            </div>
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
      </div>
    </div>
  );
};

export default ProblemTestCases;
