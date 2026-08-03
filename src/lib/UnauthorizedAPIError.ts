import { StatusCodes } from "http-status-codes";
import APIError from "./APIError";

class UnauthorizedError extends APIError {
  constructor() {
    super(
      "You are not authorized to perform this action.",
      StatusCodes.UNAUTHORIZED,
    );
  }
}

export default UnauthorizedError;
