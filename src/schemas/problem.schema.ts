import * as z from "zod";

export const ProblemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  input_format: z.string().refine(
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
  output_format: z.string().refine(
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
  constraints: z.string().refine(
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
  editorial: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
