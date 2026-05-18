import { ApiResponse } from "./api.interface";

export interface BaseHint {
  id: number;
  problem_id: number;
  hint: string;
  level: number;
  order_index: number;
}

export interface HintForm extends Omit<BaseHint, "id" | "problem_id"> {
  problem: string;
}

export type CreateHintResponse = ApiResponse<{ message: string }>;
