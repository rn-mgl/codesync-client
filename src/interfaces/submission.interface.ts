import { ApiResponse } from "./api.interface";

type SubmissionResponse = Record<
  number,
  {
    result: unknown;
    memory: number;
    runtime: number;
    matched: boolean;
  }
>;

export interface SuccessSubmission {
  success: true;
  output: SubmissionResponse;
}

export interface ErrorSubmission {
  success: false;
  message: string;
}

export type CreateSubmissionResponse = ApiResponse<{
  judge: SubmissionResponse;
}>;
