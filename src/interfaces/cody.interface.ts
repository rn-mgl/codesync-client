import { ApiResponse } from "./api.interface";

export interface BaseCody {
  output: string;
  interaction: string;
}

export type AskCodyResponse = ApiResponse<BaseCody>;

export interface Chat {
  message: string;
  sender: "cody" | "user";
  id: number;
}

export interface CodyState {
  interaction: string | null;
  chatId: number;
  chats: Chat[];
}

export type CodyAction =
  | { type: "new_session" }
  | { type: "set_interaction"; data: string }
  | { type: "set_session"; data: number }
  | { type: "push_chat"; data: Chat }
  | { type: "update_chat"; data: Pick<Chat, "id" | "message"> };
