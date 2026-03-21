import { ApiErrorDetails } from "@/interfaces/error.interface";

class ApiError extends Error implements ApiErrorDetails {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
