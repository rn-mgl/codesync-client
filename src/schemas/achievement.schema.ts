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
  difficulty: z.array(
    z.enum(VALID_DIFFICULTIES, { error: "Invalid difficulty." }),
  ).optional(),
  topic_slugs: z.array(z.string(), { error: "Topic slugs must be a list." }).optional(),
  session_type: z.array(
    z.enum(VALID_SESSIONS, { error: "Invalid session type." }),
  ).optional(),
  role: z.array(z.string(), { error: "Roles must be a list." }).optional(),
  hints_used_max: z
    .number({ error: "Hints used max must be a number." })
    .nonnegative()
    .optional(),
  language: z.array(z.string(), { error: "Languages must be a list." }).optional(),
  is_public: z.boolean({ error: "is_public must be true or false." }).optional(),
});

const UnlockSchema: z.ZodType<UnlockCriteria> = z.lazy(() =>
  z
    .object({
      version: z.number({ error: "Version must be a number." }),
      type: z.enum(VALID_TYPES, {
        error: "Unlock type is not supported.",
      }),
      match: z.enum(VALID_MATCH, {
        error: "Match must be \"all\" or \"any\".",
      }).optional(),
      metric: z.string().min(1, { error: "Metric is required for this criteria type." }).optional(),
      operator: z.enum(VALID_OPERATOR, {
        error: "Operator must be one of \"<=\", \"=\", \">=\".",
      }).optional(),
      value: z
        .number({ error: "Value must be a number." })
        .nonnegative()
        .optional(),
      scope: z.enum(VALID_SCOPE, {
        error: "Scope is not supported.",
      }).optional(),
      filters: FiltersSchema.optional(),
      conditions: z.array(UnlockSchema).optional(),
      progress_label: z
        .string()
        .min(1, { error: "Progress label cannot be empty." })
        .optional(),
    })
    .superRefine((val, ctx) => {
      if (val.conditions !== undefined && val.match === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["match"],
          message: "Select a match mode (\"all\" or \"any\") when conditions are present.",
        });
      }
    }),
);

const points = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Points must be a whole number of 0 or more.",
  });

export const AchievementSchema = z.object({
  name: z.string().trim().min(1, { error: "Please enter an achievement name." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Please enter a slug." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug must use lowercase letters, numbers and hyphens (e.g. first-blood).",
    }),
  description: z
    .string()
    .trim()
    .min(1, { error: "Please enter a description." }),
  points,
  badge_color: z.enum(BADGE_COLORS, {
    error: "Please choose a badge color.",
  }),
  category: z.enum(CATEGORIES, {
    error: "Please choose a category.",
  }),
  unlock_criteria: z
    .string()
    .min(1, { error: "Please enter the unlock criteria as JSON." })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch (error) {
        console.log(error);
        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format. Please check the unlock criteria.",
          format: "json_string",
        });

        return z.NEVER;
      }
    })
    .pipe(UnlockSchema),
});
