import { APIResponse } from "@/interfaces/api.interface";

type ENDPOINTS =
  | "problem"
  | "submission"
  | "test-case"
  | "achievement"
  | "topic"
  | "hint"
  | "queue";

type DELETE_ENDPOINTS = ENDPOINTS;

type VALIDATE_ENDPOINTS = Exclude<ENDPOINTS, "submission" | "queue">;

type identifier = string;

export interface BaseForm {
  label?: string;
  closeForm: () => void;
}

export interface UpdateForm extends BaseForm {
  postUpdateAction?: () => void;
}

export interface DeleteForm extends BaseForm {
  endpoint: `${DELETE_ENDPOINTS}/${identifier}`;
  body?: object;
  postDeleteAction?: () => void;
}

export interface ValidateForm extends BaseForm {
  endpoint: VALIDATE_ENDPOINTS;
  body: { id: string | number };
  postValidateAction?: () => void;
}

export type DeleteResponse = APIResponse<{ message: string }>;

export type ValidateResponse = APIResponse<{ message: string }>;
