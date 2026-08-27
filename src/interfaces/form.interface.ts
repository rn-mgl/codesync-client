import { APIResponse } from "@/interfaces/api.interface";

type endpoints =
  | "problem"
  | "submission"
  | "test-case"
  | "achievement"
  | "topic"
  | "hint"
  | "queue";
type identifier = string;

export interface BaseForm {
  label?: string;
  closeForm: () => void;
}

export interface UpdateForm extends BaseForm {
  postUpdateAction?: () => void;
}

export interface DeleteForm extends BaseForm {
  endpoint: `${endpoints}/${identifier}`;
  body?: object;
  postDeleteAction?: () => void;
}

export type DeleteResponse = APIResponse<{ message: string }>;
