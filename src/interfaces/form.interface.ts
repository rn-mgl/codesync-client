import { ApiResponse } from "./api.interface";

type endpoints = "problem" | "submission" | "test-case";
type identifier = string;

export interface DeleteForm {
  endpoint: `/${endpoints}/${identifier}`;
  closeForm: () => void;
  label?: string;
  postDeleteAction?: () => void;
}

export type DeleteResponse = ApiResponse<{ message: string }>;
