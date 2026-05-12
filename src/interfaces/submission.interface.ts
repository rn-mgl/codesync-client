import { ApiResponse } from "@/interfaces/api.interface";
import { SupportedLanguages } from "@/interfaces/language.interface";
import { BaseTestCase } from "@/interfaces/test-case.interface";

export interface BaseSubmission {
  id: number;
  user_id: number;
  problem_id: number;
  code: string;
  language: SupportedLanguages;
  status: SubmissionStatus;
  execution_time_ms: number;
  memory_used_mb: number;
  test_results: string | null;
  error_message: string | null;
  created_at: string;
  deleted_at: string | null;
}

export type SubmissionStatus =
  | "processing"
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "compilation_error";

export interface SubmissionResponse {
  judge: Record<
    string,
    {
      result: unknown;
      memory: number;
      runtime: number;
      matched: boolean;
      logs: unknown[];
    }
  >;
}

export type RunSummary = {
  total: number;
  passed: number;
  memory: number;
  runtime: number;
  failed: { testCase: BaseTestCase | null; output: unknown };
  code: string;
  language: SupportedLanguages;
};

export type SubmissionStatistics = {
  memory: { mb: number; percentage: number }[];
  runtime: { ms: number; percentage: number }[];
};

export type RunSubmissionResponse = ApiResponse<
  SubmissionResponse & {
    summary: RunSummary;
    statistics: SubmissionStatistics | null;
  }
>;

export type TestSubmissionResponse = ApiResponse<SubmissionResponse>;

export type CreateSubmissionResponse<T extends SubmissionType> = T extends "run"
  ? RunSubmissionResponse
  : TestSubmissionResponse;

export type GetAllSubmissionsResponse = ApiResponse<{
  submissions: BaseSubmission[];
}>;

export type SubmissionState = {
  run?:
    | (SubmissionResponse & {
        summary: RunSummary;
        statistics: SubmissionStatistics | null;
      })
    | string;
  test?: SubmissionResponse | string;
} | null;

export type SubmissionType = "run" | "test";

export type SubmissionAction =
  | {
      type: `submit_test_success`;
      output: SubmissionResponse;
    }
  | {
      type: `submit_run_success`;
      output: SubmissionResponse & {
        summary: RunSummary;
        statistics: SubmissionStatistics | null;
      };
    }
  | {
      type: `submit_${SubmissionType}_error`;
      output: string;
    }
  | { type: `clear_${SubmissionType}` };

export type SubmissionList = Pick<
  BaseSubmission,
  | "id"
  | "language"
  | "execution_time_ms"
  | "memory_used_mb"
  | "created_at"
  | "status"
>;
