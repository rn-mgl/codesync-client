"use client";

import Table from "@/src/components/ui/containers/Table";
import {
  GetAllTestCaseResponse,
  TestCaseList,
} from "@/src/interfaces/test-case.interface";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const AllTestCases = () => {
  const [testCases, setTestCases] = React.useState<TestCaseList[]>([]);

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

  const mappedTestCases = testCases.map((tc) => {
    return (
      <Link
        key={tc.id}
        href={`/codesync/test-cases/${tc.id}`}
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-2 w-full p-4 gap-4">
          <p>{tc.id}</p>
          <p>{tc.title}</p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    getTestCases();
  }, [getTestCases]);

  return (
    <Table<TestCaseList> headers={["id", "title"]} data={mappedTestCases} />
  );
};

export default AllTestCases;
