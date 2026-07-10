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

  const DIFFICULTY_COLOR = {
    easy: "var(--color-green-600)",
    medium: "var(--color-amber-600)",
    hard: "var(--color-red-600)",
  };

  const ACCEPTANCE_COLOR = {
    low: "var(--color-red-600)",
    average: "var(--color-amber-600)",
    high: "var(--color-green-600)",
  };

  const mappedProblems = problems.map((problem) => {
    const rate =
      problem.acceptance_rate < 50
        ? "low"
        : problem.acceptance_rate < 75
          ? "average"
          : "high";

    return (
      <div
        key={problem.id}
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4 text-sm items-center">
          <p>{problem.id}</p>
          <Link
            href={`/codesync/problems/${problem.slug}`}
            className="hover:underline underline-offset-2 truncate"
          >
            {problem.title}
          </Link>
          <p
            style={{ background: DIFFICULTY_COLOR[problem.difficulty] }}
            className="w-fit rounded-full px-2 py-0.5 text-secondary text-xs capitalize"
          >
            {problem.difficulty}
          </p>
          <div className="p-1 h-fit rounded-full w-full relative bg-neutral-300 flex flex-col items-start justify-start">
            <div
              style={{
                width: `${problem.acceptance_rate}%`,
                background: ACCEPTANCE_COLOR[rate],
              }}
              className=" h-full absolute rounded-full top-0 left-0"
            ></div>
          </div>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    const getProblems = async () => {
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
    };

    getProblems();
  }, []);

  return (
    <Table<ProblemList>
      headers={["id", "title", "difficulty", "acceptance_rate"]}
      data={mappedProblems}
    />
  );
};

export default AllProblems;
