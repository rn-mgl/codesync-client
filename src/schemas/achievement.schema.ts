import * as z from "zod";
import { UnlockCriteria } from "@/interfaces/achievement.interface";

const VALID_TYPES: UnlockCriteria["type"][] = [
  "composite",
  "metric_threshold",
  "special",
  "streak",
];

const VALID_SESSIONS: NonNullable<UnlockCriteria["filters"]>["session_type"] = [
  "competition",
  "interview",
  "learning",
  "practice",
];

const VALID_DIFFICULTIES: NonNullable<UnlockCriteria["filters"]>["difficulty"] =
  ["easy", "medium", "hard", "expert"];

const VALID_OPERATOR: NonNullable<UnlockCriteria["operator"]>[] = [
  "<=",
  "=",
  ">=",
];

const VALID_SCOPE: NonNullable<UnlockCriteria["scope"]>[] = [
  "current_streak",
  "daily",
  "lifetime",
  "weekly",
];

const VALID_MATCH: NonNullable<UnlockCriteria["match"]>[] = ["all", "any"];

const BADGE_COLORS = ["diamond", "gold", "silver", "bronze"] as const;

const CATEGORIES = ["problems", "streak", "social", "skill", "special"] as const;

const FiltersSchema = z.object({
  difficulty: z.array(z.enum(VALID_DIFFICULTIES)).optional(),
  topic_slugs: z.array(z.string()).optional(),
  session_type: z.array(z.enum(VALID_SESSIONS)).optional(),
  role: z.array(z.string()).optional(),
  hints_used_max: z.number().nonnegative().optional(),
  language: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
});

const UnlockSchema: z.ZodType<UnlockCriteria> = z.lazy(() =>
  z
    .object({
      version: z.number(),
      type: z.enum(VALID_TYPES),
      match: z.enum(VALID_MATCH).optional(),
      metric: z.string().min(1, { error: "Required" }).optional(),
      operator: z.enum(VALID_OPERATOR).optional(),
      value: z.number().nonnegative().optional(),
      scope: z.enum(VALID_SCOPE).optional(),
      filters: FiltersSchema.optional(),
      conditions: z.array(UnlockSchema).optional(),
      progress_label: z.string().min(1, { error: "Required" }).optional(),
    })
    .superRefine((val, ctx) => {
      if (val.conditions !== undefined && val.match === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["match"],
          message: "Match is required when conditions are present.",
        });
      }
    }),
);

const points = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Points must be a non-negative integer.",
  });

export const AchievementSchema = z.object({
  name: z.string().trim().min(1, { error: "Required" }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Required" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug must be lowercase alphanumeric with hyphens.",
    }),
  description: z.string().trim().min(1, { error: "Required" }),
  points,
  badge_color: z.enum(BADGE_COLORS),
  category: z.enum(CATEGORIES),
  unlock_criteria: z
    .string()
    .min(1, { error: "Required" })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch (error) {
        console.log(error);
        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format.",
          format: "json_string",
        });

        return z.NEVER;
      }
    })
    .pipe(UnlockSchema),
});
