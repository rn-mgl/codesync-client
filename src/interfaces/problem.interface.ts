import { ApiResponse } from "./api.interface";
import { BaseTestCase } from "./test-case.interface";
export interface BaseProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: Record<string, unknown> | unknown[];
  output_format: Record<string, unknown> | unknown[];
  constraints: string;
  editorial: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance_rate: number;
  total_submissions: number;
}

export interface ProblemForm extends Omit<
  BaseProblem,
  | "id"
  | "acceptance_rate"
  | "total_submissions"
  | "input_format"
  | "output_format"
> {
  input_format: string;
  output_format: string;
}

export type ProblemList = Pick<
  BaseProblem,
  "id" | "title" | "slug" | "difficulty" | "acceptance_rate"
>;

export type CreateProblemResponse = ApiResponse<{ message: string }>;

export type GetAllProblemsResponse = ApiResponse<{ problems: ProblemList[] }>;

export type GetProblemResponse = ApiResponse<{
  problem: BaseProblem;
  testCases: BaseTestCase[];
}>;

export type UpdateProblemResponse = ApiResponse<{ message: string }>;
