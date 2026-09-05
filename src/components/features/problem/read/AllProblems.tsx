"use client";

import Table from "@/src/components/ui/containers/Table";
import MultiSelect from "@/src/components/ui/fields/MultiSelect";
import Paginate from "@/src/components/ui/filters/Paginate";
import SearchFilter from "@/src/components/ui/filters/SearchFilter";
import SortFilter from "@/src/components/ui/filters/SortFilter";
import TableLoader from "@/src/components/ui/loader/TableLoader";
import {
  PROBLEM_SEARCH_OPTIONS,
  PROBLEM_SORT_OPTIONS,
} from "@/src/configs/filter.config";
import usePaginate from "@/src/hooks/usePaginate";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { MultiSelectOptionValue } from "@/src/interfaces/field.interface";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import { BaseTopic } from "@/src/interfaces/topic.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaTags, FaXmark } from "react-icons/fa6";

const AllProblems = (paginate: { page: number; limit: number }) => {
  const [problems, setProblems] = React.useState<ProblemList[]>([]);
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTopics, setSelectedTopics] = React.useState<
    MultiSelectOptionValue[]
  >([]);

  const {
    searchKey,
    searchValue,
    searchLabel,
    handleSearchKey,
    handleSearchValue,
    filter,
  } = useSearch(PROBLEM_SEARCH_OPTIONS, "title");

  const { sortLabel, isAsc, sortKey, handleIsAsc, handleSortKey, sort } =
    useSort(PROBLEM_SORT_OPTIONS, "title");

  const handleSelect = (option: MultiSelectOptionValue) => {
    setLoading(true);

    setSelectedTopics((prev) => {
      const index = prev.findIndex((t) => option.value === t.value);

      const value =
        index === -1
          ? [...prev, option]
          : [...prev.slice(0, index), ...prev.slice(index + 1)];

      return value;
    });
  };

  const handlePageRequest = (page: number) => {
    setLoading(true);
    handlePage(page);
  };

  const handleLimitRequest = (limit: number) => {
    setLoading(true);
    handleLimit(limit);
  };

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

  const topicOptions = topics.map((t) => ({
    label: `${t.icon} ${t.name}`,
    value: t.slug,
  }));

  const mappedSelectedTopics = selectedTopics.map((st) => {
    return (
      <div
        key={st.value}
        className="text-xs p-1 px-2 rounded-full bg-neutral-300 flex flex-row items-center justify-center gap-1"
      >
        <button
          onClick={() => handleSelect(st)}
          className="text-[0.6rem] text-neutral-600 rounded-full p-1"
        >
          <FaXmark />
        </button>
        {st.label}
      </div>
    );
  });

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
      try {
        const mappedTopics = selectedTopics.map((t) => t.value);

        const searchParams = {
          limit: String(limit),
          page: String(page),
          topics: btoa(JSON.stringify(mappedTopics)),
        };

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

        const { pagination, problems, topics } = resolve.data;

        setProblems(problems);
        setTopics(topics);
        handlePages(pagination.pages);
      } catch (err) {
        errorToast(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    getProblems();
  }, [handlePages, limit, page, selectedTopics]);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4 h-auto">
      <div className="w-full flex flex-col items-center justify-start gap-2">
        <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row t:justify-between z-30">
          <SearchFilter
            searchKey={searchKey}
            searchValue={searchValue}
            searchLabel={searchLabel}
            options={PROBLEM_SEARCH_OPTIONS}
            handleSearchKey={handleSearchKey}
            handleSearchValue={handleSearchValue}
          />

          <SortFilter
            sortLabel={sortLabel}
            handleIsAsc={handleIsAsc}
            handleSortKey={handleSortKey}
            isAsc={isAsc}
            options={PROBLEM_SORT_OPTIONS}
            sortKey={sortKey}
          />
        </div>

        <div className="w-full z-20 ">
          <MultiSelect
            activeLabel="Select a Topic"
            id="topics"
            name="topics"
            onChange={handleSelect}
            options={topicOptions}
            selectedValues={selectedTopics}
            icon={<FaTags />}
          />
        </div>

        <div className="w-full flex flex-row gap-2 flex-wrap">
          {mappedSelectedTopics}
        </div>
      </div>

      {loading ? (
        <TableLoader />
      ) : (
        <Table<ProblemList>
          headers={["id", "title", "difficulty", "acceptance_rate"]}
          data={mappedProblems}
        />
      )}

      <Paginate
        limit={limit}
        page={page}
        pages={pages}
        canSelectLimit={canSelectLimit}
        handleCanSelectLimit={handleCanSelectLimit}
        handleLimit={handleLimitRequest}
        handlePage={handlePageRequest}
      />
    </div>
  );
};

export default AllProblems;
