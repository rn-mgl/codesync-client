import * as z from "zod";

const number = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => !Number.isNaN(val), {
    error: "Must be a valid number.",
  });

export const HintSchema = z.object({
  hint: z
    .string()
    .trim()
    .min(1, { error: "Please enter the hint text." }),
  level: number,
  order_index: number,
  problem: z
    .string()
    .trim()
    .min(1, { error: "Please enter the problem slug." }),
});
