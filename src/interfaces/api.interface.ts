import { StatusCodes } from "http-status-codes";

interface BaseResponse {
  status: StatusCodes;
}

interface Success<T> extends BaseResponse {
  success: true;
  data: T;
}

interface Error extends BaseResponse {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = Success<T> | Error;
export type ServerResponse<T = unknown> =
  | Omit<Success<T>, "status">
  | Omit<Error, "status">;
