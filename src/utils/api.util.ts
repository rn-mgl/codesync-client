import { JWT } from "next-auth/jwt";
import APIError from "@/lib/APIError";
import { APIResponse, ErrorResponse } from "@/interfaces//api.interface";

export const isJWTCookie = (cookie: unknown): cookie is JWT => {
  return (
    typeof cookie === "object" &&
    cookie !== null &&
    "user" in cookie &&
    typeof cookie.user === "object" &&
    cookie.user !== null &&
    "token" in cookie.user
  );
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
