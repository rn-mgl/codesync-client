import * as z from "zod";
import { InputFormat, OutputFormat } from "../interfaces/problem.interface";

export const ProblemSchema = z.object({
  title: z.string().min(1, { error: "Required" }),
  slug: z.string().min(1, { error: "Required" }),
  description: z.string().min(1, { error: "Required" }),
  input_format: z
    .string()
    .min(1, { error: "Required" })
    .superRefine((val, ctx) => {
      try {
        const inputFormat = JSON.parse(val);

        const requiredKeys: (keyof InputFormat)[] = [
          "name",
          "params",
          "style",
          "version",
        ];

        for (const key of requiredKeys) {
          if (inputFormat[key] === undefined) {
            ctx.addIssue({
              code: "custom",
              message: `'${key}' key should exist.`,
            });
          }
        }
      } catch (error) {
        console.error(error);

        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format.",
          format: "json_string",
        });
      }
    }),
  output_format: z
    .string()
    .min(1, { error: "Required" })
    .superRefine((val, ctx) => {
      try {
        const outputFormat = JSON.parse(val);

        const requiredKeys: (keyof OutputFormat)[] = ["type", "version"];

        for (const key of requiredKeys) {
          if (outputFormat[key] === undefined) {
            ctx.addIssue({
              code: "custom",
              message: `'${key}' should exist.`,
            });
          }
        }
      } catch (error) {
        console.error(error);

        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format.",
          format: "json_string",
        });
      }
    }),
  constraints: z
    .string()
    .min(1, { error: "Required" })
    .refine(
      (string) => {
        try {
          JSON.parse(string);
          return true;
        } catch (error) {
          console.error(error);

          return false;
        }
      },
      {
        error: "Invalid JSON format",
      },
    ),
  editorial: z.string().min(1, { error: "Required" }),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
