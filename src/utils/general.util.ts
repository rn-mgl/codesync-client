export const getErrorMessage = (error: unknown): string => {
  if (error instanceof TypeError) {
    return "Unable to reach the server. Please check your internet connection and try again.";
  }

  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim()
      ? error.message.trim()
      : "Something went wrong. Please try again.";

  return message;
};
