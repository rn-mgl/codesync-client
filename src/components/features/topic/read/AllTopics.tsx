"use client";

import {
  BaseTopic,
  GetAllTopicsResponse,
} from "@/src/interfaces/topic.interface";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AllTopics = () => {
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);

  useSession({ required: true });

  const mappedTopics = topics.map((topic) => {
    return (
      <div
        key={topic.id}
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-row gap-2 group group"
      >
        <div className="aspect-square max-w-12 w-12 h-12 bg-secondary rounded-sm p-2">
          {topic.icon !== "" ? (
            <Image
              src={topic.icon}
              alt="icon"
              width={50}
              height={50}
              className="aspect-square w-fit group-hover:animate-float drop-shadow-sm"
            />
          ) : null}
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-2">
          <Link
            href={`/codesync/topics/${topic.slug}`}
            className="text-sm font-bold hover:underline underline-offset-2"
          >
            {topic.name}
          </Link>
          <p className="truncate text-xs w-full text-wrap line-clamp-1">
            {topic.description}
          </p>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetch(`/api/topic`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllTopicsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { topics } = resolve.data;

        setTopics(topics);
      } catch (error) {
        console.log(error);
      }
    };

    getTopics();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
      {mappedTopics}
    </div>
  );
};

export default AllTopics;
