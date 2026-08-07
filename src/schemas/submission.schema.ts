import * as z from "zod";

export const SubmissionSchema = z
  .object({
    type: z.enum(["run", "test"]),
    code: z.string().min(1, { error: "Required" }),
    language: z.string().min(1, { error: "Required" }),
    problem: z.string().min(1, { error: "Required" }),
    hints_used: z.number({ error: "Required" }),
  })
  .superRefine((arg, ctx) => {
    if (arg.type === "run" && arg.type === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["hints_used"],
        message: "Required",
      });
    }
  });
