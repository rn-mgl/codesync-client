import { ApiResponse } from "./api.interface";
import { BaseProblem } from "./problem.interface";

export interface BaseHint {
  id: number;
  problem_id: number;
  hint: string;
  level: number;
  order_index: number;
}

export type HintDetails = BaseHint & Pick<BaseProblem, "slug">;

export interface HintForm extends Omit<BaseHint, "id" | "problem_id" | "slug"> {
  problem: string;
}

export type ProblemHintList = Record<string, HintDetails[]>;

export type CreateHintResponse = ApiResponse<{ message: string }>;

export type UpdateHintResponse = ApiResponse<{ message: string }>;

export type GetAllHintsResponse = ApiResponse<{ hints: ProblemHintList }>;

export type GetHintResponse = ApiResponse<{ hint: HintDetails }>;
