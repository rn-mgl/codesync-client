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
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [canSelectLimit, setCanSelectLimit] = React.useState(false);

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

  const handleLimit = (limit: number) => {
    setLimit(limit);
  };

  const handlePage = (page: number) => {
    setPage(page);
  };

  const handleCanSelectLimit = () => {
    setCanSelectLimit((prev) => !prev);
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

  const mappedPages = new Array(pages).fill(0).map((_, i) => {
    return (
      <button
        key={i}
        onClick={() => handlePage(i)}
        className={`p-2 rounded-sm border aspect-square w-10 min-w-10 text-xs 
                  ${page === i ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
      >
        {i}
      </button>
    );
  });

  const mappedLimits = [10, 25, 50, 100].map((l) => {
    return (
      <button
        key={l}
        onClick={() => handleLimit(l)}
        className={`p-2 rounded-sm border aspect-square w-10 text-xs 
                  ${l === limit ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
      >
        {l}
      </button>
    );
  });

  console.log(mappedPages);

  React.useEffect(() => {
    const getProblems = async () => {
      try {
        const searchParams = { limit: String(limit), page: String(page) };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/problem?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllProblemsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { pagination, problems } = resolve.data;

        setProblems(problems);
        setPages(pagination.pages);
      } catch (err) {
        console.error(err);
      }
    };

    getProblems();
  }, [limit, page]);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      <Table<ProblemList>
        headers={["id", "title", "difficulty", "acceptance_rate"]}
        data={mappedProblems}
      />

      <div className="flex flex-row w-full justify-between">
        <div className="relative flex flex-row items-start justify-start gap-2">
          <div className="flex flex-row items-center justify-center gap-2">
            <span className="text-sm">Show</span>

            <button
              onClick={handleCanSelectLimit}
              className="p-1 text-sm border font-medium rounded-sm aspect-square w-10"
            >
              {limit}
            </button>
          </div>

          {canSelectLimit ? (
            <div className="flex flex-col items-center justify-start gap-1 absolute right-0 top-12 animate-fade">
              {mappedLimits}
            </div>
          ) : null}
        </div>

        <div className="w-fit max-w-(--breakpoint-m-m) flex items-center justify-start overflow-x-auto gap-1">
          {mappedPages}
        </div>
      </div>
    </div>
  );
};

export default AllProblems;
