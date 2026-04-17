"use client";

import {
  BaseAchievement,
  GetAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { useParams } from "next/navigation";
import React from "react";

const SingleAchievement = () => {
  const [achievement, setAchievement] = React.useState<BaseAchievement>({
    badge_color: "bronze",
    category: "problems",
    description: "",
    icon: "",
    id: 0,
    name: "",
    points: 0,
    slug: "",
    unlock_criteria: "",
  });

  const params: { slug?: string } | null = useParams();

  const getAchievement = React.useCallback(async () => {
    try {
      if (!params?.slug) return;

      const response = await fetch(`/api/achievement/${params.slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetAchievementResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { achievement } = resolve.data;
      setAchievement(achievement);
    } catch (error) {
      console.log(error);
    }
  }, [params]);

  console.log(achievement);

  React.useEffect(() => {
    getAchievement();
  }, [getAchievement]);

  return <div>SingleAchievement</div>;
};

export default SingleAchievement;
