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

const FiltersSchema = z.object({
  difficulty: z.array(z.enum(VALID_DIFFICULTIES)).optional(),
  topic_slugs: z.array(z.string()).optional(),
  session_type: z.array(z.enum(VALID_SESSIONS)).optional(),
  role: z.array(z.string()).optional(),
  hints_used_max: z.number().optional(),
  language: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
});

const UnlockSchema: z.ZodType<UnlockCriteria> = z.lazy(() =>
  z.object({
    version: z.number(),
    type: z.enum(VALID_TYPES),
    match: z.enum(VALID_MATCH),
    metric: z.string().optional(),
    operator: z.enum(VALID_OPERATOR).optional(),
    value: z.number().optional(),
    scope: z.enum(VALID_SCOPE).optional(),
    filters: FiltersSchema.optional(),
    conditions: z.array(UnlockSchema).optional(),
    progress_label: z.string().optional(),
  }),
);

export const AchievementSchema = z.object({
  name: z.string().min(1, { error: "Required" }),
  slug: z.string().min(1, { error: "Required" }),
  description: z.string().min(1, { error: "Required" }),
  icon: z.instanceof(File).or(z.url()),
  points: z.string().refine((val) => !Number.isNaN(Number(val)), {
    error: "Points must be a number.",
  }),
  unlock_criteria: z
    .string()
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch (error) {
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
