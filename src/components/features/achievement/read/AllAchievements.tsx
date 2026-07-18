"use client";

import Paginate from "@/src/components/ui/filters/Paginate";
import usePaginate from "@/src/hooks/usePaginate";
import {
  BaseAchievement,
  GetAllAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const AllAchievements = () => {
  const [achievements, setAchievements] = React.useState<
    Omit<BaseAchievement, "unlock_criteria">[]
  >([]);

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

  useSession({ required: true });

  const BADGE_COLORS: Record<string, string> = {
    bronze: "#CE8946",
    silver: "#C4C4C4",
    gold: "#EFBF04",
  };

  const mappedAchievements = achievements.map((achievement) => {
    return (
      <Link
        href={`/codesync/achievements/${achievement.slug}`}
        key={achievement.id}
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-row gap-2 group hover:bg-neutral-300 transition-all"
      >
        <div
          style={{ backgroundColor: BADGE_COLORS[achievement.badge_color] }}
          className="aspect-square max-w-12 w-12 h-12 bg-secondary rounded-sm p-1 text-lg flex flex-col items-center justify-center"
        >
          <div className="w-full flex items-center justify-center">
            <div
              dangerouslySetInnerHTML={{ __html: achievement.icon }}
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-2">
          <p className="text-sm font-bold">{achievement.name}</p>
          <p className="truncate text-xs w-full text-wrap line-clamp-1">
            {achievement.description}
          </p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    const getAchievements = async () => {
      try {
        const searchParams = {
          page: String(page),
          limit: String(limit),
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/achievement?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllAchievementResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { achievements, pagination } = resolve.data;

        setAchievements(achievements);
        handlePages(pagination.pages);
      } catch (error) {
        const message = getErrorMessage(error);
        toast(message);
      }
    };

    getAchievements();
  }, [handlePages, page, limit]);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-8">
      <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-2 l-l:grid-cols-3 gap-4">
        {mappedAchievements}
      </div>

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

export default AllAchievements;
