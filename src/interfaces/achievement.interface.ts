import { ApiResponse } from "./api.interface";

export interface UnlockCriteria {
  version: number;
  type: "metric_threshold" | "streak" | "composite" | "special";
  metric?: string;
  operator?: ">=" | "=" | "<=";
  value?: number;
  scope?: "lifetime" | "daily" | "weekly" | "current_streak";
  filters?: {
    difficulty?: ("easy" | "medium" | "hard" | "expert")[];
    topic_slugs?: string[];
    session_type?: ("practice" | "interview" | "competition" | "learning")[];
    role?: string[];
    hints_used_max?: number;
    language?: string[];
    is_public?: boolean;
  };
  conditions?: UnlockCriteria[];
  match?: "all" | "any";
  progress_label?: string;
}

export interface BaseAchievement {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badge_color: BADGE_COLORS;
  category: ACHIEVEMENT_CATEGORIES;
  unlock_criteria: UnlockCriteria;
  points: number;
}

export interface AchievementForm extends Omit<
  BaseAchievement,
  "id" | "points" | "icon" | "unlock_criteria"
> {
  icon: File | null;
  points: string;
  unlock_criteria: string;
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
