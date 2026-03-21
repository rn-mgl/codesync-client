import { ApiResponse } from "./api.interface";
import { BaseProblem } from "./problem.interface";

export interface BaseTestCase {
  id: number;
  problem_id: number;
  input: string;
  expected_output: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  order_index: number;
}

export interface TestCaseForm extends Omit<BaseTestCase, "id" | "problem_id"> {
  problem: string;
}

export type TestCaseDetails = BaseTestCase &
  Pick<BaseProblem, "slug" | "title">;

export type ProblemTestCaseList = Record<
  string,
  (Omit<BaseTestCase, "order_index" | "problem_id"> &
    Pick<BaseProblem, "slug" | "title">)[]
>;

export type CreateTestCaseResponse = ApiResponse<{ message: string }>;

export type GetAllTestCaseResponse = ApiResponse<{
  test_cases: ProblemTestCaseList;
}>;

export type GetTestCaseResponse = ApiResponse<{
  test_case: BaseTestCase & Pick<BaseProblem, "slug" | "title">;
}>;

export type UpdateTestCaseResponse = ApiResponse<{ message: string }>;
