import { ApiResponse } from "./api.interface";

interface BaseProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  editorial: string;
  difficulty: "easy" | "medium" | "hard";
}

export type ProblemForm = Omit<BaseProblem, "id">;

export type ProblemResponse = ApiResponse<{ message: string }>;
