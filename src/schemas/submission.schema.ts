import * as z from "zod";

const nonNegativeInteger = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Must be a non-negative integer.",
  });

export const SubmissionSchema = z.object({
  type: z.enum(["run", "test"]),
  code: z.string().min(1, { error: "Required" }),
  language: z.enum(["javascript", "php", "java"]),
  problem: z.string().trim().min(1, { error: "Required" }),
  hints_used: nonNegativeInteger,
});
