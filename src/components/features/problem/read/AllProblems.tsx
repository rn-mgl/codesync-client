"use client";

import TableLoader from "@/src/components/ui/loader/TableLoader";
import Table from "@/src/components/ui/containers/Table";
import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SearchFilter from "@/src/components/ui/filters/SearchFilter";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import SortFilter from "@/src/components/ui/filters/SortFilter";

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
];

const AllProblems = (paginate: { page: number; limit: number }) => {
  const [problems, setProblems] = React.useState<ProblemList[]>([]);
  const [loading, setLoading] = React.useState(true);

  const {
    searchKey,
    searchValue,
    activeLabel: activeSearchLabel,
    handleSearchKey,
    handleSearchValue,
    filter,
  } = useSearch(FILTER_OPTIONS, "title");

  const {
    activeLabel: activeSortLabel,
    isAsc,
    sortKey,
    handleIsAsc,
    handleSortKey,
    sort,
  } = useSort(FILTER_OPTIONS, "title");

  const {
    page,
    pages,
    limit,
    canSelectLimit,
    handlePages,
    handleCanSelectLimit,
    handleLimit,
    handlePage,
  } = usePaginate(paginate);

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

  const mappedProblems = sort(filter(problems)).map((problem) => {
    const rate =
      problem.acceptance_rate < 50
        ? "low"
        : problem.acceptance_rate < 75
          ? "average"
          : "high";

    return (
      <Link
        href={`/codesync/problems/${problem.slug}`}
        key={problem.id}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4 text-sm items-center">
          <p>{problem.id}</p>
          <p className="truncate">{problem.title}</p>
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
      </Link>
    );
  });

  React.useEffect(() => {
    const getProblems = async () => {
      setLoading(true);

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
        handlePages(pagination.pages);
      } catch (err) {
        errorToast(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    getProblems();
  }, [limit, page, handlePages]);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4 h-auto">
      {loading ? (
        <TableLoader />
      ) : (
        <React.Fragment>
          <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row t:justify-between">
            <SearchFilter
              searchKey={searchKey}
              searchValue={searchValue}
              activeLabel={activeSearchLabel}
              options={FILTER_OPTIONS}
              handleSearchKey={handleSearchKey}
              handleSearchValue={handleSearchValue}
            />

            <SortFilter
              activeLabel={activeSortLabel}
              handleIsAsc={handleIsAsc}
              handleSortKey={handleSortKey}
              isAsc={isAsc}
              options={FILTER_OPTIONS}
              sortKey={sortKey}
            />
          </div>

          <Table<ProblemList>
            headers={["id", "title", "difficulty", "acceptance_rate"]}
            data={mappedProblems}
          />
        </React.Fragment>
      )}

      <Paginate
        limit={limit}
        page={page}
        pages={pages}
        canSelectLimit={canSelectLimit}
        handleCanSelectLimit={handleCanSelectLimit}
        handleLimit={handleLimit}
        handlePage={handlePage}
      />
    </div>
  );
};

export default AllProblems;
