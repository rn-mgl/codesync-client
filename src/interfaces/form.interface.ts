import { ApiResponse } from "./api.interface";

export interface DeleteForm {
  endpoint: string;
  closeForm: () => void;
  label?: string;
  postDeleteAction?: () => void;
}

export type DeleteResponse = ApiResponse<{ message: string }>;
