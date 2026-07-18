"use client";

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
          className="aspect-square max-w-12 w-12 h-12 bg-secondary rounded-sm p-2 text-lg flex flex-col items-center justify-center"
        >
          <Image
            src={achievement.icon}
            alt="icon"
            width={200}
            height={200}
            draggable={false}
            className="drop-shadow-lg group-hover:animate-float w-full p-1 rounded-md"
          />
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
        const response = await fetch(`/api/achievement`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllAchievementResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { achievements } = resolve.data;

        setAchievements(achievements);
      } catch (error) {
        const message = getErrorMessage(error);
        toast(message);
      }
    };

    getAchievements();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-2 l-l:grid-cols-3 gap-4">
      {mappedAchievements}
    </div>
  );
};

export default AllAchievements;
