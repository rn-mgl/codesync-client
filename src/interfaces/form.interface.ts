import { ApiResponse } from "@/interfaces/api.interface";

type endpoints =
  | "problem"
  | "submission"
  | "test-case"
  | "achievement"
  | "topic";
type identifier = string;

export interface DeleteForm {
  endpoint: `${endpoints}/${identifier}`;
  closeForm: () => void;
  label?: string;
  postDeleteAction?: () => void;
}

export type DeleteResponse = ApiResponse<{ message: string }>;
