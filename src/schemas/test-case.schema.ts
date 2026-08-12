import * as z from "zod";

const jsonObjectString = z
  .string()
  .min(1, { error: "Please enter the test input as JSON." })
  .transform((val, ctx) => {
    try {
      return JSON.parse(val);
    } catch (error) {
      console.log(error);
      ctx.addIssue({
        code: "invalid_format",
        message: "Invalid JSON format. Please check the test input.",
        format: "json_string",
      });
      return z.NEVER;
    }
  })
  .refine(
    (val) => typeof val === "object" && val !== null && !Array.isArray(val),
    { error: "The test input must be a JSON object." },
  );

const positiveNumber = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => !Number.isNaN(val) && val > 0, {
    error: "Must be a number greater than 0.",
  });

const nonNegativeInteger = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 0, {
    error: "Must be a whole number of 0 or more.",
  });

export const TestCaseSchema = z.object({
  input: jsonObjectString,
  expected_output: z
    .string()
    .trim()
    .min(1, { error: "Please enter the expected output." }),
  problem: z
    .string()
    .trim()
    .min(1, { error: "Please enter the problem slug." }),
  time_limit_ms: positiveNumber,
  memory_limit_mb: positiveNumber,
  order_index: nonNegativeInteger.optional(),
});
