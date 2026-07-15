"use client";

import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  BaseTopic,
  GetAllTopicsResponse,
} from "@/src/interfaces/topic.interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AllTopics = () => {
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);

  const {
    pages,
    page,
    limit,
    canSelectLimit,
    handlePages,
    handleCanSelectLimit,
    handleLimit,
    handlePage,
  } = usePaginate();

  useSession({ required: true });

  const mappedTopics = topics.map((topic) => {
    return (
      <Link
        href={`/codesync/topics/${topic.slug}`}
        key={topic.id}
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
        console.log(error);
      }
    };

    getTopics();
  }, [handlePages, limit, page]);

  return (
    <div className="w-full flex flex-col items-start justify-start h-auto gap-8">
      <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
        {mappedTopics}
      </div>

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
