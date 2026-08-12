import * as z from "zod";

const email = z.email().toLowerCase().trim();
const password = z
  .string()
  .min(8, { error: "At least 8 characters." })
  .max(128, { error: "At most 128 characters." });
const username = z
  .string()
  .trim()
  .min(3, { error: "At least 3 characters." })
  .max(30, { error: "At most 30 characters." })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "Only letters, numbers and underscores are accepted.",
  });
const name = z.string().trim().min(1, { error: "Required" });

export const RegisterSchema = z.object({
  first_name: name,
  last_name: name,
  username,
  email,
  password,
});

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Required" }),
});

export const ForgotSchema = z.object({
  username: z.string().trim().min(1, { error: "Required" }),
  email,
});

export const ResetSchema = z
  .object({
    password,
    confirm_password: password,
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Passwords do not match.",
    path: ["confirm_password"],
  });

export const VerifySchema = z.object({
  token: z.jwt(),
});
