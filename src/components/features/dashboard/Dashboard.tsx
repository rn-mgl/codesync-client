"use client";

import { BADGE_COLORS } from "@/src/configs/achievement.config";
import Table from "@/src/components/ui/containers/Table";
import {
  BaseAchievement,
  GetAllAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import { BaseUser, GetUserResponse } from "@/src/interfaces/user.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { Toaster } from "sonner";

const ACCEPTANCE_COLOR: Record<string, string> = {
  low: "bg-red-600",
  average: "bg-amber-600",
  high: "bg-green-600",
};

const Dashboard = () => {
  const [user, setUser] = React.useState<BaseUser | null>(null);
  const [problems, setProblems] = React.useState<ProblemList[]>([]);
  const [achievements, setAchievements] = React.useState<
    Omit<BaseAchievement, "unlock_criteria">[]
  >([]);

  useSession({ required: true });

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, problemsRes, achievementsRes] = await Promise.all([
          fetch("/api/user", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/problem?limit=5&page=1", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/achievement?limit=4&page=1", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        const userResolve: GetUserResponse = await userRes.json();
        if (userResolve.success) {
          setUser(userResolve.data.user);
        }

        const problemsResolve: GetAllProblemsResponse =
          await problemsRes.json();
        if (problemsResolve.success) {
          setProblems(problemsResolve.data.problems);
        }

        const achievementsResolve: GetAllAchievementResponse =
          await achievementsRes.json();
        if (achievementsResolve.success) {
          setAchievements(achievementsResolve.data.achievements);
        }
      } catch (error) {
        console.error(getErrorMessage(error));
      }
    };

    fetchDashboardData();
  }, []);

  const mappedProblems = problems.map((problem) => {
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
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4 text-sm items-center">
          <p>{problem.id}</p>
          <p className="hover:underline underline-offset-2 truncate">
            {problem.title}
          </p>
          <p
            style={{
              background: `var(--color-${problem.difficulty === "easy" ? "green" : problem.difficulty === "medium" ? "amber" : "red"}-600)`,
            }}
            className="w-fit rounded-full px-2 py-0.5 text-secondary text-xs capitalize"
          >
            {problem.difficulty}
          </p>
          <div className="p-1 h-fit rounded-full w-full relative bg-neutral-300 flex flex-col items-start justify-start">
            <div
              style={{
                width: `${problem.acceptance_rate}%`,
              }}
              className={`h-full absolute rounded-full top-0 left-0 ${ACCEPTANCE_COLOR[rate]}`}
            ></div>
          </div>
        </div>
      </Link>
    );
  });

  const mappedAchievements = achievements.map((achievement) => {
    return (
      <Link
        href={`/codesync/achievements/${achievement.slug}`}
        key={achievement.id}
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-row gap-2 group hover:bg-neutral-300 transition-all"
      >
        <div
          style={{
            backgroundColor: BADGE_COLORS[achievement.badge_color] ?? "#C4C4C4",
          }}
          className="aspect-square max-w-12 w-12 h-12 bg-secondary rounded-sm p-1 text-lg flex flex-col items-center justify-center"
        >
          <div className="w-full flex items-center justify-center h-full">
            <div
              dangerouslySetInnerHTML={{ __html: achievement.icon }}
              className="w-full h-full flex items-center justify-center relative"
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

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <div className="grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 gap-4 w-full">
          <Link
            href="/codesync/problems"
            className="bg-neutral-200 rounded-lg p-4 flex flex-col gap-2 hover:bg-neutral-300 transition-all"
          >
            <FaCheckCircle className="text-success" />
            <p className="text-lg font-bold">{user?.problems_solved ?? 0}</p>
            <p className="text-xs text-neutral-500">Problems Solved</p>
          </Link>

          <Link
            href="/codesync/problems"
            className="bg-neutral-200 rounded-lg p-4 flex flex-col gap-2 hover:bg-neutral-300 transition-all"
          >
            <FaCode className="text-accent" />
            <p className="text-lg font-bold">{user?.total_submission ?? 0}</p>
            <p className="text-xs text-neutral-500">Total Submissions</p>
          </Link>

          <Link
            href="/codesync/achievements"
            className="bg-neutral-200 rounded-lg p-4 flex flex-col gap-2 hover:bg-neutral-300 transition-all t:col-span-2 l-s:col-span-1"
          >
            <FaStar className="text-warning" />
            <p className="text-lg font-bold">{achievements.length}</p>
            <p className="text-xs text-neutral-500">Achievements Earned</p>
          </Link>
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4">
          <Link
            href="/codesync/problems"
            className="text-primary font-bold flex flex-row items-center 
                      justify-center gap-2 hover:border-b px-1"
          >
            Recent Problems
            <FaArrowRight className="text-xs" />
          </Link>

          <Table<ProblemList>
            headers={["id", "title", "difficulty", "acceptance_rate"]}
            data={mappedProblems}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4">
          <Link
            href="/codesync/achievements"
            className="text-primary font-bold flex flex-row items-center 
                      justify-center gap-2 hover:border-b px-1"
          >
            <FaStar />
            Achievements
          </Link>

          {achievements.length === 0 ? (
            <div className="bg-neutral-200 rounded-lg p-4 w-full">
              <p className="text-sm text-neutral-500">
                No achievements yet. Keep solving problems!
              </p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
              {mappedAchievements}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
