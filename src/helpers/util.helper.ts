export const handleToastErrorMessage = (error: unknown) => {
  const message =
    (typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string" &&
      error?.message) ||
    "An unexpected error occurred.";

  return message;
};
