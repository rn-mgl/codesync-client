import { ApiResponse } from "./api.interface";

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

export type CreateTestCaseResponse = ApiResponse<{ message: string }>;
