import { JWT } from "next-auth/jwt";

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
