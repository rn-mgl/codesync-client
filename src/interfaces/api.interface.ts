import { StatusCodes } from "http-status-codes";

interface BaseResponse {
  status: StatusCodes;
}

interface ISuccess<T> {
  success: true;
  data: T;
}

export interface IError extends BaseResponse {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = ISuccess<T> | IError;

export type ServerResponse<T = unknown> =
  | Omit<ISuccess<T>, "status">
  | Omit<IError, "status">;
