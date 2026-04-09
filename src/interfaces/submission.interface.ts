import { ApiResponse } from "./api.interface";
import { SupportedLanguages } from "./language.interface";
import { BaseTestCase } from "./test-case.interface";

interface BaseSubmission {
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

export type SubmissionResponse = Record<
  number,
  {
    result: unknown;
    memory: number;
    runtime: number;
    matched: boolean;
  }
>;

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

export type CreateSubmissionResponse<T extends SubmissionType> = T extends "run"
  ? ApiResponse<{
      judge: SubmissionResponse;
      summary: RunSummary;
      statistics: SubmissionStatistics | null;
    }>
  : ApiResponse<{
      judge: SubmissionResponse;
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
