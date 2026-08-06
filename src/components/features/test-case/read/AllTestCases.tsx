"use client";

import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  GetTestCaseCountResponse,
  ProblemTestCaseCount,
} from "@/src/interfaces/test-case.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import React from "react";
import ProblemTestCases from "./ProblemTestCases";
import useSearch from "@/src/hooks/useSearch";
import SearchFilter from "@/src/components/ui/filters/SearchFilter";
import SortFilter from "@/src/components/ui/filters/SortFilter";
import useSort from "@/src/hooks/useSort";

const SEARCH_OPTIONS = [
  {
    label: "Problem",
    value: "problem",
  },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Problem", value: "problem" },
  { label: "Count", value: "count" },
];

const AllTestCases = (props: {
  problem?: string;
  page: number;
  limit: number;
}) => {
  const [testCases, setTestCases] = React.useState<ProblemTestCaseCount>({});
  const [selectedProblem, setSelectedProblem] = React.useState<string | null>(
    props.problem ?? null,
  );
  const [loading, setLoading] = React.useState(true);

  const {
    searchKey,
    searchValue,
    activeLabel,
    handleSearchKey,
    handleSearchValue,
    filter,
  } = useSearch(SEARCH_OPTIONS, "problem");

  const {
    activeLabel: activeSortLabel,
    isAsc,
    sortKey,
    handleIsAsc,
    handleSortKey,
    sort,
  } = useSort(SORT_OPTIONS, "problem");

  const {
    pages,
    page,
    limit,
    canSelectLimit,
    handleCanSelectLimit,
    handleLimit,
    handlePage,
    handlePages,
  } = usePaginate({ page: props.page, limit: props.limit });

  const handleSelectedProblem = (problem: string) => {
    setSelectedProblem((prev) => (prev === problem ? null : problem));
  };

  const problemParam = props?.problem;

  const restructuredProblem = Object.entries(testCases ?? {}).map(
    ([problem, count]) => ({ problem, count }),
  );

  const mappedProblems = sort(filter(restructuredProblem)).map((tc) => {
    return (
      <button
        key={tc.problem}
        onClick={() => handleSelectedProblem(tc.problem)}
        className="w-full text-left bg-neutral-200 rounded-lg p-4 flex flex-col items-start justify-start gap-2 cursor-pointer hover:bg-neutral-300 transition-all"
      >
        <p className="text-sm font-bold capitalize truncate w-full">
          {normalizeString(tc.problem)}
        </p>

        <p className="text-xs text-neutral-500">
          {tc.count} {tc.count === 1 ? "test case" : "test cases"}
        </p>
      </button>
    );
  });

  React.useEffect(() => {
    const getTestCases = async () => {
      setLoading(true);

      try {
        const searchParams = {
          problem: problemParam ?? "",
          limit: String(limit),
          page: String(page),
          list_all: "0",
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/test-case?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetTestCaseCountResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { test_cases, pagination } = resolve.data;

        setTestCases(test_cases);
        handlePages(pagination.pages);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getTestCases();
  }, [problemParam, limit, page, handlePages]);

  return (
    <div className="flex flex-col items-center justify-start gap-8 w-full">
      {loading ? (
        <BlockLoader />
      ) : (
        <React.Fragment>
          <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row t:justify-between">
            <SearchFilter
              searchKey={searchKey}
              searchValue={searchValue}
              activeLabel={activeLabel}
              options={SEARCH_OPTIONS}
              handleSearchKey={handleSearchKey}
              handleSearchValue={handleSearchValue}
            />

            <SortFilter
              activeLabel={activeSortLabel}
              handleIsAsc={handleIsAsc}
              handleSortKey={handleSortKey}
              isAsc={isAsc}
              options={SORT_OPTIONS}
              sortKey={sortKey}
            />
          </div>

          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
            {mappedProblems}
          </div>
        </React.Fragment>
      )}
      {selectedProblem && (
        <ProblemTestCases
          selectedProblem={selectedProblem}
          handleSelectedProblem={handleSelectedProblem}
          limit={limit}
          page={page}
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

export default AllTestCases;
