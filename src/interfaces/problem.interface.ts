import * as Monaco from "monaco-editor";
import { ApiResponse } from "./api.interface";
import { SupportedLanguages } from "./language.interface";
import { SubmissionResponse, SubmissionType } from "./submission.interface";
import { BaseTestCase } from "./test-case.interface";

export interface InputFormat {
  style: "function" | "class";
  version: number;
  name: string;
  params: { name: string; type: string }[];
}

export interface OutputFormat {
  version: number;
  type: string;
  comparison: Record<string, unknown>;
}

export interface BaseProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: InputFormat;
  output_format: OutputFormat;
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

export interface TestCaseSectionProps {
  testCases: BaseTestCase[];
  handleClearSubmissionState: (type: SubmissionType) => void;
  submittedTestOutput:
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        output: SubmissionResponse;
      }
    | null;
}
