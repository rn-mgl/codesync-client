import { IApiError } from "../interfaces/error.interface";

class ApiError extends Error implements IApiError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
