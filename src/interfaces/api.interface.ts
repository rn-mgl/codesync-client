import { StatusCodes } from "http-status-codes";

interface BaseResponse {
  status: StatusCodes;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export type ServerResponse<T = unknown> =
  | Omit<SuccessResponse<T>, "status">
  | Omit<ErrorResponse, "status">;
