import { ApiResponse } from "@/interfaces/api.interface";
import {
  RunSubmissionResponse,
  SubmissionResponse,
  SubmissionType,
} from "@/interfaces/submission.interface";
import { BaseTestCase } from "@/interfaces/test-case.interface";
import { BaseTopic } from "@/interfaces/topic.interface";

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

export type Constraints = Record<string, { min: number; max: number } | string>;

export interface BaseProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: InputFormat;
  output_format: OutputFormat;
  constraints: Constraints;
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
  | "constraints"
> {
  input_format: string;
  output_format: string;
  constraints: string;
}

export interface ProblemPayload extends Omit<
  BaseProblem,
  | "id"
  | "acceptance_rate"
  | "total_submissions"
  | "input_format"
  | "output_format"
  | "constraints"
> {
  input_format: string;
  output_format: string;
  constraints: string;
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
  topics: BaseTopic[];
}>;

export type UpdateProblemResponse = ApiResponse<{ message: string }>;

export type GetSubmissionResponse = RunSubmissionResponse;

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

export type DetailsPanel =
  | "description"
  | "editorial"
  | "submission"
  | "result";
