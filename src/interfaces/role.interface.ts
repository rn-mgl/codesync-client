import { APIPaginateResponse, APIResponse } from "./api.interface";

export interface BaseRole {
  id: number;
  role: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type RoleForm = Pick<BaseRole, "role">;

export type RoleList = Pick<BaseRole, "id" | "role" | "created_at">;

export type GetAllRolesResponse = APIResponse<
  { roles: BaseRole[] } & APIPaginateResponse
>;

export type GetRoleResponse = APIResponse<{ role: BaseRole }>;

export type CreateRoleResponse = APIResponse<{ message: string }>;

export type UpdateRoleResponse = APIResponse<{ message: string }>;
