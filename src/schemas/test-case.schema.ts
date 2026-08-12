import * as z from "zod";

const jsonObjectString = z
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
  .refine(
    (val) => typeof val === "object" && val !== null && !Array.isArray(val),
    { error: "Must be a JSON object." },
  );

const positiveNumber = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => !Number.isNaN(val) && val > 0, {
    error: "Must be a positive number.",
  });

const nonNegativeInteger = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Must be a non-negative integer.",
  });

export const TestCaseSchema = z.object({
  input: jsonObjectString,
  expected_output: z.string().trim().min(1, { error: "Required" }),
  problem: z.string().trim().min(1, { error: "Required" }),
  time_limit_ms: positiveNumber,
  memory_limit_mb: positiveNumber,
  order_index: nonNegativeInteger.optional(),
});
