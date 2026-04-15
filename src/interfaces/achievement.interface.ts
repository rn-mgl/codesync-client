import { ApiResponse } from "./api.interface";

export interface BaseAchievement {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badge_color: BADGE_COLORS;
  category: ACHIEVEMENT_CATEGORIES;
  unlock_criteria: string;
  points: number;
}

export interface AchievementForm extends Omit<
  BaseAchievement,
  "id" | "points"
> {
  points: string;
}

export type AchievementPayload = Omit<BaseAchievement, "id">;

type BADGE_COLORS = "diamond" | "gold" | "silver" | "bronze";

type ACHIEVEMENT_CATEGORIES =
  | "problems"
  | "streak"
  | "social"
  | "skill"
  | "special";

export type GetAllAchievementResponse = ApiResponse<{
  achievements: Omit<BaseAchievement, "unlock_criteria">[];
}>;
