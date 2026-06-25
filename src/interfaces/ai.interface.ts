import { ApiResponse } from "./api.interface";

export interface BaseCody {
  output: string;
  interaction: string;
}

export type AskCodyResponse = ApiResponse<BaseCody>;
