import { ApiResponse } from "./api.interface";

export type CreateSubmissionResponse = ApiResponse<{
  validation: Record<number, boolean>;
}>;
