import { ApiResponse } from "@/interfaces/api.interface";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPayload {
  username: string;
  email: string;
}

export interface ResetPayload {
  password: string;
  confirm_password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

interface BaseResponse {
  success: true;
}

export type LoginResponse = ApiResponse<
  {
    token: string;
    user: {
      id: number;
      is_verified: boolean;
    };
  } & BaseResponse
>;

export type RegisterResponse = ApiResponse<
  {
    success: boolean;
    token: string;
  } & BaseResponse
>;

export type ForgotResponse = ApiResponse<BaseResponse>;

export type ResetResponse = ApiResponse<BaseResponse>;
