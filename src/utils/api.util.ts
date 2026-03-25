import { JWT } from "next-auth/jwt";
import ApiError from "../lib/ApiError";
import { ApiResponse, ErrorResponse } from "../interfaces/api.interface";

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
  const isApiError = error instanceof ApiError;

  const errorResponse: ApiResponse = {
    success: false,
    message: isApiError ? error.message : "An unexpected error occurred.",
    status: isApiError ? error.statusCode : 500,
  };

  return errorResponse;
};
