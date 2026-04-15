"use client";

import Table from "@/src/components/ui/containers/Table";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AllProblems = () => {
  const [problems, setProblems] = React.useState<ProblemList[]>([]);

  useSession({ required: true });

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
      <div
        key={problem.id}
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4">
          <p>{problem.id}</p>
          <Link
            href={`/codesync/problems/${problem.slug}`}
            className="hover:underline underline-offset-2"
          >
            {problem.title}
          </Link>
          <p>{problem.difficulty}</p>
          <p>{problem.acceptance_rate}</p>
        </div>
      </div>
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
