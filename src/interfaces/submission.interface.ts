import { ApiResponse } from "./api.interface";

export type SubmissionResponse = Record<
  number,
  {
    result: unknown;
    memory: number;
    runtime: number;
    matched: boolean;
  }
>;

export type CreateSubmissionResponse = ApiResponse<{
  judge: SubmissionResponse;
}>;

export type SubmissionState = {
  output?: SubmissionResponse;
  type: SubmissionType;
  message?: string;
  success: boolean;
} | null;

export type SubmissionType = "run" | "test";

export type SubmissionAction =
  | {
      type: `submit_${SubmissionType}_success`;
      output: SubmissionResponse;
    }
  | {
      type: `submit_${SubmissionType}_error`;
      output: string;
    };
