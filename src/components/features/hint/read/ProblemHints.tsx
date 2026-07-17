"use client";

import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetAllHintsResponse,
  HintDetails,
  ProblemHintProperties,
} from "@/src/interfaces/hint.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import Link from "next/link";
import React from "react";

import {
  FaArrowDown19,
  FaBrain,
  FaLightbulb,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";

const ProblemHints = (props: ProblemHintProperties) => {
  const [hints, setHints] = React.useState<HintDetails[]>([]);

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
    const getHints = async () => {
      try {
        const searchParams = {
          problem: props.selectedProblem ?? "",
          limit: String(limit),
          page: String(page),
          list_all: "1",
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

        const { hints, pagination } = resolve.data;

        setHints(hints[props.selectedProblem]);
        handlePages(pagination.pages);
      } catch (error) {
        console.log(error);
      }
    };

    getHints();
  }, [handlePages, props.selectedProblem, limit, page]);

  const mappedHints = hints.map((hint) => (
    <Link
      key={hint.id}
      href={`/codesync/hints/${hint.id}`}
      className="w-full flex flex-col items-start justify-center gap-2 p-4 bg-neutral-200 rounded-md hover:bg-neutral-300 transition-all"
    >
      <p className="font-bold text-base">Hint {hint.id}</p>

      <div className="flex items-center w-full truncate gap-2">
        <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
          <span>Hint</span>
          <FaLightbulb />
        </div>
        <span className="truncate bg-secondary p-1 px-2 rounded-md w-full text-sm">
          {hint.hint}
        </span>
      </div>

      <div className="flex items-center w-full truncate gap-2">
        <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
          <span>Level</span>
          <FaBrain />
        </div>
        <span className="truncate bg-secondary p-1 px-2 rounded-md w-full text-sm">
          {hint.level}
        </span>
      </div>

      <div className="flex items-center w-full truncate gap-2">
        <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
          <span>Order Index</span>
          <FaArrowDown19 />
        </div>
        <span className="truncate bg-secondary p-1 px-2 rounded-md w-full text-sm">
          {hint.order_index}
        </span>
      </div>
    </Link>
  ));

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

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-4 overflow-y-auto">
          <div className="w-full flex items-center justify-end">
            <Link
              href={`/codesync/hints/create?problem=${props.selectedProblem}`}
              className="text-primary font-normal flex flex-row items-center
                            justify-center gap-2 hover:bg-secondary/20 p-1 text-sm hover:border-b px-1"
            >
              <span>Add Hint</span>
              <FaPlus />
            </Link>
          </div>

          {hints.length === 0 ? (
            <p className="text-sm text-neutral-500">No hints yet.</p>
          ) : (
            <div className="grid grid-cols-1 items-start justify-start gap-4 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4">
              {mappedHints}
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

export default ProblemHints;
