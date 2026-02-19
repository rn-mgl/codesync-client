import * as z from "zod";

const email = z.email().toLowerCase().trim();
const password = z.string().min(8);
const username = z.string().trim();

export const RegisterSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username,
  email,
  password,
});

export const LoginSchema = z.object({
  email,
  password: z.string(),
});

export const ForgotSchema = z.object({
  username,
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
