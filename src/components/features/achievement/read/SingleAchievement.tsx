"use client";

import {
  BaseAchievement,
  GetAchievementResponse,
  UnlockCriteria,
} from "@/src/interfaces/achievement.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

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
    unlock_criteria: {
      type: "metric_threshold",
      version: 1,
    },
  });

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

  const mappedCriteria = Object.entries(achievement.unlock_criteria).map(
    ([criteriaKey, criteriaValue]) => {
      const mappedFilters =
        criteriaKey === "filters" &&
        Object.entries(criteriaValue as UnlockCriteria).map(
          ([filterKey, filterValue]) => {
            return (
              <div
                key={filterKey}
                className="flex flex-row gap-1 items-start justify-start text-sm"
              >
                <span className="text-secondary bg-primary/80 p-1 rounded-sm capitalize">
                  {normalizeString(filterKey)}
                </span>

                <span className="p-1 rounded-sm bg-secondary">
                  {Array.isArray(filterValue)
                    ? filterValue.join(", ")
                    : filterValue}
                </span>
              </div>
            );
          },
        );

      const mappedConditions =
        criteriaKey === "conditions" &&
        [criteriaValue as UnlockCriteria[]].map((nestedConditions) => {
          return nestedConditions.map((nestedCriteria) => {
            return Object.entries(nestedCriteria).map(
              ([nestedKey, nestedValue]) => {
                return (
                  <div
                    key={nestedKey}
                    className="flex flex-row gap-1 items-start justify-start text-sm"
                  >
                    <span className="text-secondary bg-primary p-1 rounded-sm capitalize">
                      {normalizeString(nestedKey)}
                    </span>

                    <div className="p-1 rounded-sm bg-secondary capitalize flex flex-col gap-2">
                      {normalizeString(String(nestedValue))}
                    </div>
                  </div>
                );
              },
            );
          });
        });

      return (
        <div
          key={criteriaKey}
          className="flex flex-row gap-1 items-start justify-start text-sm"
        >
          <span className="text-secondary bg-primary p-1 rounded-sm capitalize">
            {normalizeString(criteriaKey)}
          </span>

          <div className="p-1 rounded-sm bg-secondary capitalize flex flex-col gap-2">
            {criteriaKey === "filters"
              ? mappedFilters
              : criteriaKey === "conditions"
                ? mappedConditions
                : normalizeString(String(criteriaValue))}
          </div>
        </div>
      );
    },
  );

  React.useEffect(() => {
    getAchievement();
  }, [getAchievement]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8 h-full l-l:overflow-hidden">
      <Link
        href="/codesync/achievements"
        className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1 w-fit"
      >
        <FaArrowLeft />
        All Achievements
      </Link>

      <div className="grid grid-cols-1 h-full gap-4 items-center justify-center l-l:grid-cols-2 w-full l-l:overflow-hidden">
        <div className="w-full flex h-full flex-col l-l:overflow-hidden">
          <div className="w-full flex h-full flex-col gap-4 l-l:overflow-hidden">
            <div className="w-full flex flex-col items-center justify-center bg-neutral-200 rounded-lg p-2 t:p-4">
              <div
                style={{
                  background: `linear-gradient(135deg, ${BADGE_PALETTE[achievement.badge_color].primary}, ${BADGE_PALETTE[achievement.badge_color].secondary}, ${BADGE_PALETTE[achievement.badge_color].primary})`,
                }}
                className="w-full flex items-center justify-center aspect-video rounded-sm overflow-hidden"
              >
                {achievement.icon && (
                  <Image
                    src={achievement.icon}
                    width={400}
                    height={400}
                    alt="Icon"
                    className="animate-float drop-shadow-lg w-5/12"
                  />
                )}
              </div>
            </div>

            <div className="border border-neutral-400 p-2 rounded-lg flex flex-col t:p-4 gap-4 h-full l-l:overflow-hidden">
              <h1 className="font-bold text-center">{achievement.name}</h1>

              <div className="w-full border border-neutral-200"></div>

              <div className="p-2 rounded-sm bg-neutral-200 overflow-y-auto text-sm min-h-40 max-h-96 l-l:max-h-none h-full t:p-4">
                <p>{achievement.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border h-full rounded-lg p-2 t:p-4 flex flex-col gap-4 border-neutral-400">
          <h1 className="font-bold text-center">Criteria</h1>

          <div className="w-full border border-neutral-200"></div>

          <div className="p-2 rounded-sm bg-neutral-200 h-full overflow-y-auto text-sm t:text-base t:p-4 flex flex-col gap-2">
            {mappedCriteria}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAchievement;
