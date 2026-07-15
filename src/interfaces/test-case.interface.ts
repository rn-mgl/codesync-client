import { APIPaginateResponse, APIResponse } from "@/interfaces/api.interface";
import { BaseProblem } from "@/interfaces/problem.interface";

export interface BaseTestCase {
  id: number;
  problem_id: number;
  input: Record<string, unknown>;
  expected_output: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  order_index: number;
  is_sample: boolean;
  is_hidden: boolean;
}

export interface TestCaseForm extends Omit<
  BaseTestCase,
  | "id"
  | "problem_id"
  | "time_limit_ms"
  | "memory_limit_mb"
  | "order_index"
  | "input"
> {
  input: string;
  problem: string;
  time_limit_ms: string;
  memory_limit_mb: string;
  order_index: string;
}

export interface TestCasePayload extends Omit<
  BaseTestCase,
  "id" | "problem_id" | "input"
> {
  input: string;
  problem: string;
}

export type TestCaseDetails = BaseTestCase &
  Pick<BaseProblem, "slug" | "title">;

export type ProblemTestCaseProperties = Omit<
  BaseTestCase,
  "order_index" | "problem_id"
> &
  Pick<BaseProblem, "slug" | "title">;

export type ProblemTestCaseList = Record<string, ProblemTestCaseProperties[]>;

export type CreateTestCaseResponse = APIResponse<{ message: string }>;

export type GetAllTestCaseResponse = APIResponse<
  {
    test_cases: ProblemTestCaseList;
  } & APIPaginateResponse
>;

export type GetTestCaseResponse = APIResponse<{
  test_case: BaseTestCase & Pick<BaseProblem, "slug" | "title">;
}>;

export type UpdateTestCaseResponse = APIResponse<{ message: string }>;
