import * as z from "zod";

const email = z
  .email({ error: "Please enter a valid email address." })
  .toLowerCase()
  .trim();
const password = z
  .string()
  .min(8, { error: "Password must be at least 8 characters." })
  .max(128, { error: "Password must be at most 128 characters." });
const username = z
  .string()
  .trim()
  .min(3, { error: "Username must be at least 3 characters." })
  .max(30, { error: "Username must be at most 30 characters." })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "Username can only contain letters, numbers and underscores.",
  });
const firstName = z
  .string()
  .trim()
  .min(1, { error: "Please enter your first name." });
const lastName = z
  .string()
  .trim()
  .min(1, { error: "Please enter your last name." });

export const RegisterSchema = z.object({
  first_name: firstName,
  last_name: lastName,
  username,
  email,
  password,
});

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Please enter your password." }),
});

export const ForgotSchema = z.object({
  username: z.string().trim().min(1, { error: "Please enter your username." }),
  email,
});

export const ResetSchema = z
  .object({
    password,
    confirm_password: password,
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Passwords do not match. Please try again.",
    path: ["confirm_password"],
  });

export const VerifySchema = z.object({
  token: z.jwt({ error: "The verification link is invalid or has expired." }),
});
