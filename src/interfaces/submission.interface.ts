import { ApiResponse } from "./api.interface";
import { BaseTestCase } from "./test-case.interface";

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
  failed: null | { testCase: BaseTestCase; output: unknown };
};

export type CreateSubmissionResponse<T extends SubmissionType> = T extends "run"
  ? ApiResponse<{
      judge: SubmissionResponse;
      summary: RunSummary;
    }>
  : ApiResponse<{
      judge: SubmissionResponse;
    }>;

export type SubmissionState = {
  run?: (SubmissionResponse & { summary: RunSummary }) | string;
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
      output: SubmissionResponse & { summary: RunSummary };
    }
  | {
      type: `submit_${SubmissionType}_error`;
      output: string;
    }
  | { type: `clear_${SubmissionType}` };
