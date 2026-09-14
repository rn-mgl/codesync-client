import { APIPaginateResponse, APIResponse } from "./api.interface";

export interface BaseRole {
  id: number;
  role: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type RoleList = Pick<BaseRole, "id" | "role">;

export type GetAllRolesResponse = APIResponse<
  { roles: BaseRole[] } & APIPaginateResponse
>;
