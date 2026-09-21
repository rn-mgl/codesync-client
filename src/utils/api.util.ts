import { JWT } from "next-auth/jwt";
import APIError from "@/lib/APIError";
import { APIResponse, ErrorResponse } from "@/interfaces//api.interface";

export const isJWTCookie = (cookie: unknown): cookie is JWT => {
  const REQUIRED_FIELDS = ["token", "permission"];

  if (typeof cookie !== "object") return false;

  if (cookie === null) return false;

  if (!("user" in cookie)) return false;

  if (typeof cookie.user !== "object") return false;

  if (cookie.user === null) return false;

  return REQUIRED_FIELDS.every((field) => field in cookie);
};

export const validateDependencies = () => {
  const DEPENDENCIES = ["APP_URL"];

  return DEPENDENCIES.every(
    (dependency) =>
      process.env[dependency] !== undefined &&
      typeof process.env[dependency] === "string",
  );
};

export const handleErrorResponse = (error: unknown): ErrorResponse => {
  const isAPIError = error instanceof APIError;

  const errorResponse: APIResponse = {
    success: false,
    message: isAPIError ? error.message : "An unexpected error occurred.",
    status: isAPIError ? error.statusCode : 500,
  };

  return errorResponse;
};
