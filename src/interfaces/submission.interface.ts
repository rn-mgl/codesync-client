import { ApiResponse } from "./api.interface";

export type CreateSubmissionResponse = ApiResponse<{
  judge: Record<number, boolean>;
}>;
