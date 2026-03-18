import * as z from "zod";

export const SubmissionSchema = z.object({
  type: z.enum(["run", "test"]),
  code: z.string().min(1, { error: "Required" }),
  language: z.string().min(1, { error: "Required" }),
  problem: z.string().min(1, { error: "Required" }),
});
