import * as z from "zod";

const number = z
  .union([z.number(), z.string()])
  .transform((val) => Number(val))
  .refine((val) => !Number.isNaN(val), {
    error: "Must be a number.",
  });

export const HintSchema = z.object({
  hint: z.string().min(1, { error: "Required" }),
  level: number,
  order_index: number,
  problem: z.string().min(1, { error: "Required" }),
});
