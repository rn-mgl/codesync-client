"use client";

import {
  BaseHint,
  GetAllHintsResponse,
  ProblemHintList,
} from "@/src/interfaces/hint.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import Link from "next/link";
import React from "react";
import {
  FaArrowDown19,
  FaArrowTurnUp,
  FaBrain,
  FaLightbulb,
  FaPlus,
} from "react-icons/fa6";

const AllHints = (props: { problem?: string }) => {
  const [hints, setHints] = React.useState<ProblemHintList>({});

  const problemParam = props.problem;

  const mappedHints = Object.entries(hints).map(([problem, hints]) => {
    return (
      <div
        key={problem}
        className="w-full flex flex-col items-center justify-center gap-4"
      >
        <div className="bg-primary text-secondary font-bold w-full p-4 rounded-md text-sm flex flex-row justify-between">
          <p className="truncate capitalize">{normalizeString(problem)}</p>

          <Link
            href={`/codesync/hints/create?problem=${problem}`}
            className="text-secondary font-normal flex flex-row items-center 
                              justify-center gap-2 hover:border-b px-1"
          >
            <span className="hidden t:flex">Add Hint</span>

            <FaPlus />
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 items-center justify-start gap-4 t:grid-cols-2 l-l:grid-cols-4">
          {hints.map((hint) => {
            return (
              <div
                key={hint.id}
                className="w-full flex flex-col items-center justify-center"
              >
                <div className="w-full flex flex-col items-start justify-center text-sm">
                  <Link
                    href={`/codesync/hints/${hint.id}`}
                    className="w-full p-4 border-b border-b-neutral-300 bg-neutral-200 rounded-t-md group"
                  >
                    <p className="font-bold text-base group-hover:underline underline-offset-2">
                      Hint {hint.id}
                    </p>
                  </Link>

                  <div className="w-full p-4 flex flex-col items-start justify-center gap-2 bg-neutral-300 rounded-b-md">
                    <div className="flex items-center w-full truncate gap-2">
                      <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                        <span>Hint</span>
                        <FaLightbulb />
                      </div>
                      <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                        {hint.hint}
                      </span>
                    </div>

                    <div className="flex items-center w-full truncate gap-2">
                      <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                        <span>Level</span>
                        <FaBrain />
                      </div>
                      <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                        {hint.level}
                      </span>
                    </div>

                    <div className="flex items-center w-full truncate gap-2">
                      <div className="flex items-center justify-center bg-primary p-1 rounded-md text-secondary gap-1 text-xs px-2">
                        <span>Order Index</span>
                        <FaArrowDown19 />
                      </div>
                      <span className="truncate bg-secondary p-1 px-2 rounded-md w-full">
                        {hint.order_index}
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
  });

  React.useEffect(() => {
    const getHints = async () => {
      try {
        const searchParams = {
          problem: problemParam ?? "",
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

        const { hints } = resolve.data;

        setHints(hints);
      } catch (error) {
        console.log(error);
      }
    };

    getHints();
  }, [problemParam]);

  return mappedHints;
};

export default AllHints;
