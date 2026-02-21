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

export type LoginResponse = ApiResponse<{
  token: string | null;
  user: {
    id: number;
    is_verified: boolean;
  };
}>;

export type RegisterResponse = ApiResponse<{
  success: boolean;
  token: string;
}>;

export type ForgotResponse = ApiResponse<{ message: string }>;

export type ResetResponse = ApiResponse<{ message: string }>;

export type VerifyResponse = ApiResponse<{ verified: boolean }>;
