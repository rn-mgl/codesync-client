import { APIResponse } from "./api.interface";

export interface BaseCody {
  id: number;
  name: string;
  user_id: number;
  input: string;
  output: string;
  previous_interaction: string;
  interaction: string;
}

export type AskCodyResponse = APIResponse<BaseCody>;
export type GetAllCodyResponse = APIResponse<{ chats: BaseCody[] }>;
export type GetHistoryResponse = APIResponse<{
  chats: Chat[];
  interaction: string;
}>;

export interface Chat {
  input: string;
  sender: "cody" | "user";
  id: number;
}

export interface CodyState {
  interaction: string | null;
  chats: Chat[];
}

export type CodyAction =
  | { type: "new_session" }
  | { type: "set_interaction"; data: string }
  | { type: "push_chat"; data: Chat }
  | { type: "update_chat"; data: Pick<Chat, "id" | "input"> }
  | { type: "use_history"; data: CodyState };
