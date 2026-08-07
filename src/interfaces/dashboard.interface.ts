import { APIResponse } from "@/interfaces/api.interface";
import { BaseAchievement } from "@/interfaces/achievement.interface";
import { BaseProblem } from "@/interfaces/problem.interface";

export interface RecentAchievement extends BaseAchievement {
  earned_at: string;
}

export interface RecentProblem extends BaseProblem {
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  problems_solved: number;
  submissions_today: number;
  achievements_earned: number;
  recent_achievements: RecentAchievement[];
  recent_problems: RecentProblem[];
}

export type GetDashboardResponse = APIResponse<{
  dashboard: DashboardStats;
}>;
