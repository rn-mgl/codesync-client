import { ApiResponse } from "./api.interface";

export interface BaseUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  problems_solved: number;
  total_submission: number;
  is_verified: boolean;
}

export type GetUserResponse = ApiResponse<{ user: BaseUser }>;
