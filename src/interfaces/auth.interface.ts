import { APIResponse } from "@/interfaces/api.interface";

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

export type LoginResponse = APIResponse<{
  token: string | null;
  user: {
    id: number;
    is_verified: boolean;
    name: string;
    image: string | null;
  };
}>;

export type RegisterResponse = APIResponse<{
  token: string;
}>;

export type ForgotResponse = APIResponse<{ message: string }>;

export type ResetResponse = APIResponse<{ message: string }>;

export type VerifyResponse = APIResponse<{ verified: boolean }>;
