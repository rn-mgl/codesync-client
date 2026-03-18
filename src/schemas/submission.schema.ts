import * as z from "zod";

export const SubmissionSchema = z.object({
  type: z.enum(["run", "test"]),
  code: z.string(),
  language: z.string(),
  problem: z.string(),
});
