import * as z from "zod";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { error: "Please enter a slug." })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "Slug must use lowercase letters, numbers and hyphens (e.g. dynamic-programming).",
  });

export const TopicSchema = z.object({
  name: z.string().trim().min(1, { error: "Please enter a topic name." }),
  slug,
  description: z
    .string()
    .trim()
    .min(1, { error: "Please enter a topic description." }),
  icon: z
    .string()
    .trim()
    .min(1, { error: "Please choose an icon." })
    .refine((c) => {
      const emojis = [...c];

      return emojis.length === 1 && /\p{Extended_Pictographic}/u.test(c);
    }, { error: "Icon must be a single emoji." }),
});
