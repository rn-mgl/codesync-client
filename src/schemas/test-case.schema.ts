import * as z from "zod";

export const TestCaseSchema = z.object({
  input: z
    .string()
    .min(1, { error: "Required" })
    .superRefine((val, ctx) => {
      try {
        JSON.parse(val);
      } catch (error) {
        console.log(error);
        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format",
          format: "json_string",
        });
      }
    }),
  expected_output: z.string().min(1, { error: "Required" }),
  problem: z.string().min(1, { error: "Required" }),
  time_limit_ms: z.number(),
  memory_limit_mb: z.number(),
  order_index: z.number().optional(),
});
