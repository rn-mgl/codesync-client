"use client";

import {
  BaseAchievement,
  GetAllAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const AllAchievements = () => {
  const [achievements, setAchievements] = React.useState<
    Omit<BaseAchievement, "unlock_criteria">[]
  >([]);

  const BADGE_PALETTE: Record<string, { primary: string; secondary: string }> =
    {
      bronze: {
        primary: "#CE8946",
        secondary: "#FCA956",
      },
      silver: {
        primary: "#C4C4C4",
        secondary: "#E0E0E0",
      },
      gold: {
        primary: "#EFBF04",
        secondary: "#FFC766",
      },
    };

  const getAchievements = React.useCallback(async () => {
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
  }, []);

  const mappedAchievements = achievements.map((achievement) => {
    return (
      <div
        key={achievement.id}
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-col gap-2 group"
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${BADGE_PALETTE[achievement.badge_color].primary}, ${BADGE_PALETTE[achievement.badge_color].secondary}, ${BADGE_PALETTE[achievement.badge_color].primary})`,
          }}
          className="w-full aspect-video rounded-sm flex flex-col items-center justify-center overflow-hidden"
        >
          <Image
            src={achievement.icon}
            alt="icon"
            width={200}
            height={200}
            draggable={false}
            className="drop-shadow-lg group-hover:animate-float w-4/12"
          />
        </div>

        <div className="w-full flex flex-col gap-2 text-center text-sm">
          <div className="w-full flex flex-row items-center justify-between">
            <Link
              href={`codesync/achievements/${achievement.slug}`}
              className="font-bold truncate hover:underline underline-offset-2 transition-all"
            >
              {achievement.name}
            </Link>
            <p className="font-medium">{achievement.points}</p>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <p className="w-full text-left">{achievement.description}</p>
          </div>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    getAchievements();
  }, [getAchievements]);

  return (
    <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
      {mappedAchievements}
    </div>
  );
};

export default AllAchievements;
