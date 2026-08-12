import * as z from "zod";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Required" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "Slug must be lowercase alphanumeric with hyphens.",
  });

const jsonString = <T extends z.ZodType>(schema: T) =>
  z
    .string()
    .min(1, { error: "Required" })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch (error) {
        console.error(error);
        ctx.addIssue({
          code: "invalid_format",
          message: "Invalid JSON format.",
          format: "json_string",
        });
        return z.NEVER;
      }
    })
    .pipe(schema);

const InputFormatSchema = z.object({
  name: z.string().min(1, { error: "Required" }),
  style: z.enum(["function", "class"]),
  version: z.number(),
  method: z.string().min(1, { error: "Required" }).optional(),
  params: z.array(
    z.object({
      name: z.string().min(1, { error: "Required" }),
      type: z.string().min(1, { error: "Required" }),
    }),
  ),
});

const OutputFormatSchema = z.object({
  version: z.number(),
  type: z.string().min(1, { error: "Required" }),
  comparison: z.record(z.string(), z.unknown()),
});

const ConstraintsSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.object({
      min: z.number(),
      max: z.number(),
    }),
  ]),
);

export const ProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Required" }),
  slug,
  description: z.string().trim().min(1, { error: "Required" }),
  input_format: jsonString(InputFormatSchema),
  output_format: jsonString(OutputFormatSchema),
  constraints: jsonString(ConstraintsSchema),
  editorial: z.string().trim().min(1, { error: "Required" }),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
