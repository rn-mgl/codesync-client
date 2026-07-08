import * as z from "zod";

export const TopicSchema = z.object({
  name: z.string().min(1, { error: "Required" }),
  slug: z.string().min(1, { error: "Required" }),
  description: z.string().min(1, { error: "Required" }),
  icon: z.string().refine((c) => {
    const emojis = [...c];

    const matchedAll = [...emojis].filter((e) =>
      /\p{Extended_Pictographic}/u.test(e),
    );

    return emojis.length === 1 && matchedAll;
  }, `Only one emoji is accepted.`),
});
