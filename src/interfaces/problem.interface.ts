import { ApiResponse } from "./api.interface";
export interface BaseProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  editorial: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance_rate: number;
  total_submissions: number;
}

export type ProblemForm = Omit<
  BaseProblem,
  "id" | "acceptance_rate" | "total_submissions"
>;

export type ProblemList = Pick<
  BaseProblem,
  "id" | "title" | "slug" | "difficulty" | "acceptance_rate"
>;

export type CreateProblemResponse = ApiResponse<{ message: string }>;
export type GetAllProblemsResponse = ApiResponse<{ problems: ProblemList[] }>;
