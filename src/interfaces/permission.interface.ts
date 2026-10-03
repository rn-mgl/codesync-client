import { APIPaginateResponse, APIResponse } from "./api.interface";

export interface BasePermission {
  id: number;
  permission: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type PermissionForm = Pick<BasePermission, "permission" | "description">;

export type PermissionList = Pick<
  BasePermission,
  "id" | "permission" | "description" | "created_at"
>;

export type GetAllPermissionsResponse = APIResponse<
  { permissions: BasePermission[] } & APIPaginateResponse
>;

export type GetPermissionResponse = APIResponse<{ permission: BasePermission }>;

export type CreatePermissionResponse = APIResponse<{ message: string }>;

export type UpdatePermissionResponse = APIResponse<{ message: string }>;
