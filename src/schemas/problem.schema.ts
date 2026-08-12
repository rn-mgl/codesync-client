import * as z from "zod";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Please enter a slug." })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "Slug must use lowercase letters, numbers and hyphens (e.g. two-sum).",
  });

const jsonString = <T extends z.ZodType>(
  schema: T,
  messages: { empty: string; invalid: string },
) =>
  z
    .string()
    .min(1, { error: messages.empty })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch (error) {
        console.error(error);
        ctx.addIssue({
          code: "invalid_format",
          message: messages.invalid,
          format: "json_string",
        });
        return z.NEVER;
      }
    })
    .pipe(schema);

const InputFormatSchema = z.object({
  name: z
    .string({ error: "Input format must include a function name." })
    .min(1, { error: "Input format must include a function name." }),
  style: z.enum(["function", "class"], {
    error: "Input format style must be \"function\" or \"class\".",
  }),
  version: z.number({ error: "Input format must include a numeric version." }),
  method: z
    .string({ error: "Method cannot be empty." })
    .min(1, { error: "Method cannot be empty." })
    .optional(),
  params: z.array(
    z.object({
      name: z
        .string({ error: "Each parameter needs a name." })
        .min(1, { error: "Each parameter needs a name." }),
      type: z
        .string({ error: "Each parameter needs a type." })
        .min(1, { error: "Each parameter needs a type." }),
    }),
    { error: "Input format must include a list of parameters." },
  ),
});

const OutputFormatSchema = z.object({
  version: z.number({ error: "Output format must include a numeric version." }),
  type: z
    .string({ error: "Output format must include a return type." })
    .min(1, { error: "Output format must include a return type." }),
  comparison: z.record(z.string(), z.unknown(), {
    error: "Output format must include a comparison object.",
  }),
});

const ConstraintsSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.object({
      min: z.number({ error: "Constraint min must be a number." }),
      max: z.number({ error: "Constraint max must be a number." }),
    }),
  ]),
);

export const ProblemSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a problem title." }),
  slug,
  description: z
    .string()
    .trim()
    .min(1, { error: "Please enter a problem description." }),
  input_format: jsonString(InputFormatSchema, {
    empty: "Please enter the input format as JSON.",
    invalid: "Invalid JSON format. Please check the input format.",
  }),
  output_format: jsonString(OutputFormatSchema, {
    empty: "Please enter the output format as JSON.",
    invalid: "Invalid JSON format. Please check the output format.",
  }),
  constraints: jsonString(ConstraintsSchema, {
    empty: "Please enter the constraints as JSON.",
    invalid: "Invalid JSON format. Please check the constraints.",
  }),
  editorial: z
    .string()
    .trim()
    .min(1, { error: "Please enter an editorial." }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    error: "Please choose a difficulty.",
  }),
});
