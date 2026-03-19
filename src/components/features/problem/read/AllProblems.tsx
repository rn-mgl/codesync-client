"use client";

import Table from "@/src/components/ui/containers/Table";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import Link from "next/link";
import React from "react";

const AllProblems = () => {
  const [problems, setProblems] = React.useState<ProblemList[]>([]);

  const getProblems = React.useCallback(async () => {
    try {
      const response = await fetch("/api/problem", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetAllProblemsResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      setProblems(resolve.data.problems);
    } catch (err) {
      console.error(err);
    }

    return;
  }, []);

  const mappedProblems = problems.map((problem) => {
    return (
      <Link
        key={problem.id}
        href={`/codesync/problems/${problem.slug}`}
        target="_blank"
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4">
          <p>{problem.id}</p>
          <p>{problem.title}</p>
          <p>{problem.difficulty}</p>
          <p>{problem.acceptance_rate}</p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    getProblems();
  }, [getProblems]);

  return (
    <Table<ProblemList>
      headers={["id", "title", "difficulty", "acceptance_rate"]}
      data={mappedProblems}
    />
  );
};

export default AllProblems;
