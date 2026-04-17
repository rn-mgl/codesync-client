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
  "id" | "points" | "icon"
> {
  icon: File | null;
  points: string;
}

export interface AchievementPayload extends Omit<
  BaseAchievement,
  "id" | "icon"
> {
  icon: File | null;
}

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

export type CreateAchievementResponse = ApiResponse<{ message: string }>;

export type GetAchievementResponse = ApiResponse<{
  achievement: BaseAchievement;
}>;
