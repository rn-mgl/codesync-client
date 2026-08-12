import * as z from "zod";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Required" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "Slug must be lowercase alphanumeric with hyphens.",
  });

export const TopicSchema = z.object({
  name: z.string().trim().min(1, { error: "Required" }),
  slug,
  description: z.string().trim().min(1, { error: "Required" }),
  icon: z
    .string()
    .trim()
    .min(1, { error: "Required" })
    .refine((c) => {
      const emojis = [...c];

      return emojis.length === 1 && /\p{Extended_Pictographic}/u.test(c);
    }, "Only one emoji is accepted."),
});
