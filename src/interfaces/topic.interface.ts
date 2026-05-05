import { ApiResponse } from "./api.interface";

export interface BaseTopic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface TopicForm extends Pick<
  BaseTopic,
  "name" | "slug" | "description"
> {
  icon: File | string | null;
}

export type CreateTopicResponse = ApiResponse<{ message: string }>;

export type GetAllTopicResponse = ApiResponse<{ topics: BaseTopic[] }>;

export type GetTopicResponse = ApiResponse<{ topic: BaseTopic }>;

export type UpdateTopicResponse = ApiResponse<{ message: string }>;
