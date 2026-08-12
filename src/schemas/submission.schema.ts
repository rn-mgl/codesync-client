import * as z from "zod";

const nonNegativeInteger = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Must be a whole number of 0 or more.",
  });

export const SubmissionSchema = z.object({
  type: z.enum(["run", "test"], {
    error: "Submission type must be \"run\" or \"test\".",
  }),
  code: z.string().min(1, { error: "Please write some code before submitting." }),
  language: z.enum(["javascript", "php", "java"], {
    error: "Please choose a supported language.",
  }),
  problem: z
    .string()
    .trim()
    .min(1, { error: "Please select a problem to submit." }),
  hints_used: nonNegativeInteger,
});
