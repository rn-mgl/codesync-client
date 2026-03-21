"use client";

import {
  GetAllTestCaseResponse,
  ProblemTestCaseList,
} from "@/src/interfaces/test-case.interface";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMemory,
  FaRegClock,
} from "react-icons/fa6";

const AllTestCases = () => {
  const [testCases, setTestCases] = React.useState<ProblemTestCaseList>({});

  const params = useSearchParams();

  const getTestCases = React.useCallback(async () => {
    try {
      const searchParams = {
        problem: params?.get("problem") ?? "",
      };

      const query = new URLSearchParams(searchParams).toString();

      const response = await fetch(`/api/test-case?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetAllTestCaseResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { test_cases } = resolve.data;

      setTestCases(test_cases);
    } catch (error) {
      console.log(error);
    }
  }, [params]);

  const mappedTestCases = Object.entries(testCases ?? {}).map(
    ([problem, testCase]) => {
      return (
        <div
          key={problem}
          className="w-full flex flex-col items-center justify-center gap-4"
        >
          <div className="bg-primary text-secondary font-bold w-full p-4 rounded-md">
            {problem}
          </div>

          <div className="w-full grid grid-cols-1 items-center justify-start gap-4 t:grid-cols-2 l-l:grid-cols-4">
            {testCase.map((tc) => {
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
                          {JSON.stringify(tc.expected_output)}
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
                          <FaRegClock />
                        </div>
                        <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                          {JSON.stringify(tc.time_limit_ms)} ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  );

  React.useEffect(() => {
    getTestCases();
  }, [getTestCases]);

  return mappedTestCases;
};

export default AllTestCases;
