import { APIPaginateResponse, APIResponse } from "./api.interface";
import { BasePermission } from "./permission.interface";

export interface BaseRole {
  id: number;
  role: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface RolePermissions {
  role: string;
  permission: string;
  role_id: number;
  permission_id: number;
}

export type RoleForm = Pick<BaseRole, "role">;

export type RoleList = Pick<BaseRole, "id" | "role" | "created_at">;

export type GetAllRolesResponse = APIResponse<
  { roles: BaseRole[] } & APIPaginateResponse
>;

export type GetRoleResponse = APIResponse<{
  role: BaseRole;
  permissions: RolePermissions[];
}>;

export type GetRolePermissions = APIResponse<{
  role_permissions: RolePermissions[];
  permissions: BasePermission[];
}>;

export type CreateRoleResponse = APIResponse<{ message: string }>;

export type UpdateRoleResponse = APIResponse<{ message: string }>;

export type CreateRolePermissionResponse = APIResponse<{ message: string }>;
