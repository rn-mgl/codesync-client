"use client";

import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  BaseTopic,
  GetAllTopicsResponse,
} from "@/src/interfaces/topic.interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SearchFilter from "@/src/components/ui/filters/SearchFilter";
import useSearch from "@/src/hooks/useSearch";
import SortFilter from "@/src/components/ui/filters/SortFilter";
import useSort from "@/src/hooks/useSort";
import {
  TOPIC_SEARCH_OPTIONS,
  TOPIC_SORT_OPTIONS,
} from "@/src/configs/filter.config";

const AllTopics = (paginate: { page: number; limit: number }) => {
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);
  const [loading, setLoading] = React.useState(true);

  const {
    searchKey,
    searchValue,
    searchLabel,
    handleSearchKey,
    handleSearchValue,
    filter,
  } = useSearch(TOPIC_SEARCH_OPTIONS, "name");

  const {
    sortLabel,
    isAsc,
    sortKey,
    handleIsAsc,
    handleSortKey,
    sort,
  } = useSort(TOPIC_SORT_OPTIONS, "name");

  const {
    pages,
    page,
    limit,
    canSelectLimit,
    handlePages,
    handleCanSelectLimit,
    handleLimit,
    handlePage,
  } = usePaginate(paginate);

  useSession({ required: true });

  const mappedTopics = sort(filter(topics)).map((topic) => {
    return (
      <Link
        href={`/codesync/topics/${topic.slug}`}
        key={topic.id}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-row gap-2 group group hover:bg-neutral-300 transition-all"
      >
        <div className="aspect-square max-w-12 w-12 h-12 bg-secondary rounded-sm p-2 text-lg flex flex-col items-center justify-center">
          {topic.icon}
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-2">
          <p className="text-sm font-bold">{topic.name}</p>
          <p className="truncate text-xs w-full text-wrap line-clamp-1">
            {topic.description}
          </p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    const getTopics = async () => {
      setLoading(true);

      try {
        const searchParams = {
          limit: String(limit),
          page: String(page),
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/topic?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllTopicsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { topics, pagination } = resolve.data;

        setTopics(topics);
        handlePages(pagination.pages);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, [handlePages, limit, page]);

  return (
    <div className="w-full flex flex-col items-start justify-start h-auto gap-8">
      <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row t:justify-between">
        <SearchFilter
          searchKey={searchKey}
          searchValue={searchValue}
          searchLabel={searchLabel}
          options={TOPIC_SEARCH_OPTIONS}
          handleSearchKey={handleSearchKey}
          handleSearchValue={handleSearchValue}
        />

        <SortFilter
          sortLabel={sortLabel}
          handleIsAsc={handleIsAsc}
          handleSortKey={handleSortKey}
          isAsc={isAsc}
          options={TOPIC_SORT_OPTIONS}
          sortKey={sortKey}
        />
      </div>

      {loading ? (
        <BlockLoader />
      ) : (
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
          {mappedTopics}
        </div>
      )}

      <Paginate
        limit={limit}
        page={page}
        pages={pages}
        canSelectLimit={canSelectLimit}
        handleCanSelectLimit={handleCanSelectLimit}
        handlePage={handlePage}
        handleLimit={handleLimit}
      />
    </div>
  );
};

export default AllTopics;
