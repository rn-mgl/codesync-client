import { APIResponse } from "@/interfaces/api.interface";
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
}

export type SubmissionStatus =
  | "processing"
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "compilation_error";

// Per-test-case verdict produced by the judge.
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

// Judge verdict of a full "run" (summary + performance statistics included).
export type RunSubmission = SubmissionResponse & {
  summary: RunSummary;
  statistics: SubmissionStatistics | null;
};

export type RunSubmissionResponse = APIResponse<RunSubmission>;

export type TestSubmissionResponse = APIResponse<SubmissionResponse>;

export type CreateSubmissionResponse<T extends SubmissionType> = T extends "run"
  ? RunSubmissionResponse
  : TestSubmissionResponse;

export type GetAllSubmissionsResponse = APIResponse<{
  submissions: BaseSubmission[];
}>;

export type GetAllSubmissionCounts = APIResponse<{
  submissions: Record<string, number>;
}>;

// Raw reducer state: each entry is either a judge result or an error string.
export type SubmissionState = {
  run?: RunSubmission | string;
  test?: SubmissionResponse | string;
} | null;

export type SubmissionType = "run" | "test";

export type SubmissionAction =
  | { type: "submit_test_success"; output: SubmissionResponse }
  | { type: "submit_test_error"; output: string }
  | { type: "submit_run_success"; output: RunSubmission }
  | { type: "submit_run_error"; output: string }
  | { type: `clear_${SubmissionType}` };

// Normalized submission output consumed by the UI: collapses the raw
// "result object | error string" state into a single { success, error, output }.
export type TestSubmissionResult = {
  success: boolean;
  error: string;
  output: SubmissionResponse;
} | null;

export type RunSubmissionResult = {
  success: boolean;
  error: string;
  output: SubmissionResponse;
  summary: RunSummary | null;
  statistics: SubmissionStatistics | null;
} | null;

export type SubmissionList = Pick<
  BaseSubmission,
  | "id"
  | "language"
  | "execution_time_ms"
  | "memory_used_mb"
  | "created_at"
  | "status"
>;
