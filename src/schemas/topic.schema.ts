import * as z from "zod";

export const TopicSchema = z.object({
  name: z.string().min(1, { error: "Required" }),
  slug: z.string().min(1, { error: "Required" }),
  description: z.string().min(1, { error: "Required" }),
  icon: z
    .instanceof(File)
    .refine((file) => file.type.includes("image"), `Only images are accepted.`)
    .or(z.url()),
});
