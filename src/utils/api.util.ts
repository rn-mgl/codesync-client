import { APIResponse, ErrorResponse } from "@/interfaces//api.interface";
import APIError from "@/lib/APIError";
import { JWT } from "next-auth/jwt";

export const isJWTCookie = (cookie: unknown): cookie is JWT => {
  const REQUIRED_FIELDS = ["token", "permission"];

  if (typeof cookie !== "object") return false;

  if (cookie === null) return false;

  if (!("user" in cookie)) return false;

  const user = cookie.user;

  if (typeof user !== "object") return false;

  if (user === null) return false;

  return REQUIRED_FIELDS.every((field) => field in user);
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

export const getPermissions = (cookies: JWT) => {
  const permissions = cookies.user.permission;

  return permissions.join("~");
};
