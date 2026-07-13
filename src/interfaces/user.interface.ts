import { APIResponse } from "./api.interface";

export interface BaseUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  problems_solved: number;
  total_submission: number;
  is_verified: boolean;
  image: string;
}

export interface UserForm extends Pick<
  BaseUser,
  "first_name" | "last_name" | "username"
> {
  image: File | string | null;
}

export interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export type GetUserResponse = APIResponse<{ user: BaseUser }>;

export type UpdateUserResponse = APIResponse<{ message: string }>;
