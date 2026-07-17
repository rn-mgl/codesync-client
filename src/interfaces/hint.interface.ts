import { APIPaginateResponse, APIResponse } from "./api.interface";
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

export interface ProblemHintProperties {
  selectedProblem: string;
  handleSelectedProblem: (problem: string) => void;
}

export type ProblemHintList = Record<string, HintDetails[]>;

export type ProblemHintCount = Record<string, number>;

export type CreateHintResponse = APIResponse<{ message: string }>;

export type UpdateHintResponse = APIResponse<{ message: string }>;

export type GetAllHintsResponse = APIResponse<
  { hints: ProblemHintList } & APIPaginateResponse
>;

export type GetHintsCountResponse = APIResponse<
  { hints: ProblemHintCount } & APIPaginateResponse
>;

export type GetHintResponse = APIResponse<{ hint: HintDetails }>;
