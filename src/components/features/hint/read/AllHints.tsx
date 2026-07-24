"use client";

import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetHintsCountResponse,
  ProblemHintCount,
} from "@/src/interfaces/hint.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import React from "react";
import ProblemHints from "./ProblemHints";

const AllHints = (props: { problem?: string }) => {
  const [hints, setHints] = React.useState<ProblemHintCount>({});
  const [selectedProblem, setSelectedProblem] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);

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

  const problemParam = props.problem;

  const handleSelectedProblem = (problem: string) => {
    setSelectedProblem((prev) => (prev === problem ? null : problem));
  };

  const mappedProblems = Object.entries(hints).map(([problem, count]) => {
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
          {count} {count === 1 ? "hint" : "hints"}
        </p>
      </button>
    );
  });

  React.useEffect(() => {
    const getHints = async () => {
      setLoading(true);

      try {
        const searchParams = {
          problem: problemParam ?? "",
          limit: String(limit),
          page: String(page),
          list_all: "0",
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/hint?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetHintsCountResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { hints, pagination } = resolve.data;

        setHints(hints);
        handlePages(pagination.pages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getHints();
  }, [handlePages, problemParam, limit, page]);

  return (
    <div className="w-full flex flex-col gap-8 itemsce justify-start">
      {loading ? (
        <BlockLoader />
      ) : (
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
          {mappedProblems}
        </div>
      )}

      {selectedProblem && (
        <ProblemHints
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

export default AllHints;
