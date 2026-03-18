import * as z from "zod";

export const ProblemSchema = z.object({
  title: z.string().min(1, { error: "Required" }),
  slug: z.string().min(1, { error: "Required" }),
  description: z.string().min(1, { error: "Required" }),
  input_format: z
    .string()
    .min(1, { error: "Required" })
    .refine(
      (string) => {
        try {
          JSON.parse(string);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        error: "Invalid JSON format",
      },
    ),
  output_format: z
    .string()
    .min(1, { error: "Required" })
    .refine(
      (string) => {
        try {
          JSON.parse(string);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        error: "Invalid JSON format",
      },
    ),
  constraints: z
    .string()
    .min(1, { error: "Required" })
    .refine(
      (string) => {
        try {
          JSON.parse(string);
          return true;
        } catch (error) {
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
